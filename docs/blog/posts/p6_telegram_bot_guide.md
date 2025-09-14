---
title: "File Manager Bot with Aiogram 3 (by ExploitX)"
description: "A telegram bot implementation that shows basics of Aiogram 3 in action."
date: 2025-09-14
categories:
  - Backend
tags:
    - python
---



A telegram bot implementation that shows basics of Aiogram 3 in action.

<!-- more --> 

## General Plan

This bot lets users upload, categorize, and retrieve files directly through Telegram messages. We aim to use as much aiogram features as we can in a practical way. Let’s go through the whole process step by step. The overall plan is as follows:

- User registration and management
- File upload with automatic categorization
- Browse files by category (Photos, Videos, Documents)
- Download previously uploaded files
- Clean inline keyboard interface


## Implementation


!!! note "Tech Stack"  
    We use the following technologies to achieve our goal:

    - **Aiogram 3.x** - Modern async Telegram bot framework
    - **PostgreSQL** - Reliable database for file metadata
    - **SQLAlchemy** - Async ORM for database operations
    - **Alembic** - Database migrations

### Project Structure

Here’s how I organized the project:

```
app/
├── __init__.py
├── database.py      # Database connection
├── models.py        # SQLAlchemy models
├── middleware.py    # Database session middleware
└── routers/
    ├── start.py     # /start command
    ├── menu.py      # Navigation menus
    ├── upload.py    # File upload logic
    └── files.py     # File retrieval
main.py              # Bot entry point
requirements.txt     # Dependencies
.env                # Environment variables
```

### Project Setup

This project uses **PIP** (Python package installer and resolver) for dependency management.

```bash
# Initialize new project

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install aiogram
```

Create a `.env` file with your credentials:

```env
DB_NAME=your_database_name
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
BOT_TOKEN=your_bot_token_from_botfather
```

### Database Setup

As we are using `aiogram` which is asynchronous, we need an async postgres driver. So we used `asyncpg` over `psycopg2`. Here is the implementation:

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os
from dotenv import load_dotenv

load_dotenv()

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_session():
    async with SessionLocal() as session:
        yield session
```

Here, we have a asynchronous generator function `get_session` that yields a session from the database, which we'll use as a dependency. Even though in Aiogram we don't have dependency injection, we'll soon achieve the behaviour using Middlewares.

### Database Models

We kept the models simple but effective. Two main entities: User and File with a one-to-many relationship:

```python
from typing import List, Optional
from sqlalchemy import String, ForeignKey, BigInteger, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
import enum

class FileCategory(str, enum.Enum):
    document = "Document"
    image = "Image"
    video = "Video"
    other = "Other"

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, index=True, autoincrement=True)
    telegram_id: Mapped[int] = mapped_column(BigInteger, unique=True, nullable=False, index=True)
    username: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    fullname: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    files: Mapped[List["File"]] = relationship(back_populates="user", cascade="all, delete-orphan")

class File(Base):
    __tablename__ = "files"
    
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"))
    file_id: Mapped[str] = mapped_column(String, nullable=False)
    file_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    category: Mapped[FileCategory] = mapped_column(Enum(FileCategory), default=FileCategory.other)
    
    user: Mapped["User"] = relationship(back_populates="files")
```

### Database Migrations with Alembic

We ran into an issue during migration setup. The error was:

```
ModuleNotFoundError: No module named 'asyncpg'
```

The reason is we are using `asyncpg` driver for postgres, and that requires us to override the built-in `alembic/env.py` file. We should include a directive to show how to run async migrations:

```python
def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    
    await connectable.dispose()
```

Remember to install asyncpg: `pip install asyncpg`

### Database Session Middleware

As we said, Aiogram does not natively support dependency injection, which FastAPI does. So, we learn from FastAPI and mimic that behaviour using middlewares:

```python
from aiogram import BaseMiddleware
from typing import Callable, Dict, Any, Awaitable
from app.database import SessionLocal

class DbSessionMiddleware(BaseMiddleware):
    async def __call__(
        self,
        handler: Callable[[Dict[str, Any]], Awaitable[Any]],
        event: Any,
        data: Dict[str, Any]
    ) -> Any:
        session = SessionLocal()
        data["db"] = session
        
        try:
            result = await handler(event, data)
        finally:
            await session.close()
        
        return result
```

This middlewares ensures that in every request, our router will have an access (session) to the database and freely can work with it.

### User Registration Handler

The start command handles user registration elegantly:

```python
from aiogram import Router
from aiogram.types import Message
from aiogram.filters import CommandStart
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import User
from app.routers.menu import main_menu

router = Router()

@router.message(CommandStart())
async def cmd_start(message: Message, db: AsyncSession):
    user = message.from_user
    
    result = await db.execute(
        select(User).where(User.telegram_id == user.id)
    )
    existing_user = result.scalar_one_or_none()
    
    if not existing_user:
        new_user = User(
            telegram_id=user.id,
            username=user.username,
            fullname=user.full_name,
        )
        db.add(new_user)
        await db.commit()
    
    await message.answer(
        f"Hey! What's up, {user.full_name or user.username}!\nChoose from the menu below:",
        reply_markup=main_menu()
    )
```

### Navigation Menus

I created reusable keyboard functions for clean navigation:

```python
from aiogram import Router, F
from aiogram.types import CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton

router = Router()

def main_menu() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="📤 Upload File", callback_data="upload_file")],
            [InlineKeyboardButton(text="📂 My Files", callback_data="my_files")],
        ]
    )

def category_menu() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🖼 Photos", callback_data="category_image")],
            [InlineKeyboardButton(text="🎥 Videos", callback_data="category_video")],
            [InlineKeyboardButton(text="📄 Documents", callback_data="category_document")],
            [InlineKeyboardButton(text="📂 All Files", callback_data="category_all")],
        ]
    )

@router.callback_query(F.data == "my_files")
async def show_category_menu(callback: CallbackQuery):
    await callback.message.answer("📂 Choose the category", reply_markup=category_menu())
    await callback.answer()
```

### File Upload Logic

The upload handler uses FSM (Finite State Machine) for step-by-step file uploading:

```python
from aiogram import Router, F
from aiogram.types import CallbackQuery, Message, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from app.models import File, FileCategory, User
from sqlalchemy import select

router = Router()

class UploadStates(StatesGroup):
    waiting_for_category = State()
    waiting_for_file = State()

@router.callback_query(F.data == "upload_file")
async def upload_file_request(callback: CallbackQuery, state: FSMContext):
    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="📷 Photos", callback_data="choose_category:image")],
            [InlineKeyboardButton(text="📄 Documents", callback_data="choose_category:document")],
            [InlineKeyboardButton(text="🎥 Videos", callback_data="choose_category:video")],
        ]
    )
    await callback.message.answer("📂 Choose the category", reply_markup=kb)
    await state.set_state(UploadStates.waiting_for_category)
    await callback.answer()

@router.message(F.document | F.photo | F.video)
async def receive_file(message: Message, state: FSMContext, db):
    # Smart file type detection
    if message.photo:
        file_category = FileCategory.image
        file_id = message.photo[-1].file_id
        filename = f"Photo_{file_id}.jpg"
    elif message.video:
        file_category = FileCategory.video
        file_id = message.video.file_id
        file_name = message.video.file_name or f"Video_{file_id}.mp4"
    elif message.document:
        if message.document.mime_type.startswith("image/"):
            file_category = FileCategory.image
        elif message.document.mime_type.startswith("video/"):
            file_category = FileCategory.video
        else:
            file_category = FileCategory.document
        file_id = message.document.file_id
        file_name = message.document.file_name
    
    # Save to database
    user_id = message.from_user.id
    result = await db.execute(select(User).where(User.telegram_id == user_id))
    user = result.scalars().first()
    
    new_file = File(
        user_id=user.id,
        file_id=file_id,
        file_name=file_name,
        category=file_category
    )
    db.add(new_file)
    await db.commit()
    await state.clear()
    
    await message.answer(f"✅ File saved successfully ({file_category.name})")
```

### File Retrieval System

Users can browse and download their files by category:

```python
from aiogram import Router, F
from aiogram.types import CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from app.models import File, FileCategory, User
from sqlalchemy import select

router = Router()

@router.callback_query(F.data.startswith("category_"))
async def list_files_by_category(callback: CallbackQuery, db):
    user_id = callback.from_user.id
    cat = callback.data.split("_")[1]
    
    query = select(File).join(User).where(User.telegram_id == user_id)
    
    if cat != "all":
        query = query.where(File.category == getattr(FileCategory, cat))
    
    result = await db.execute(query)
    files = result.scalars().all()
    
    if not files:
        await callback.message.answer("❌ No files found in this category.")
    else:
        kb = InlineKeyboardMarkup(
            inline_keyboard=[
                [InlineKeyboardButton(text=f.file_name, callback_data=f"get_file:{f.id}")]
                for f in files
            ]
        )
        await callback.message.answer(f"📂 {cat.capitalize()} files:", reply_markup=kb)
    
    await callback.answer()

@router.callback_query(F.data.startswith("get_file:"))
async def send_file_handler(callback: CallbackQuery, db):
    file_id = int(callback.data.split(":")[1])
    file = await db.get(File, file_id)
    
    if not file:
        await callback.message.answer("❌ File not found.")
        return
    
    # Send appropriate file type
    if file.category == FileCategory.image:
        await callback.message.answer_photo(file.file_id, caption=file.file_name)
    elif file.category == FileCategory.document:
        await callback.message.answer_document(file.file_id, caption=file.file_name)
    elif file.category == FileCategory.video:
        await callback.message.answer_video(file.file_id, caption=file.file_name)
    
    await callback.answer()
```

### Main Application

Finally, everything comes together in the main file:

```python
import asyncio
import logging
import os
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from app.routers import start, menu, files, upload
from app.middleware import DbSessionMiddleware
from dotenv import load_dotenv

load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")

logging.basicConfig(level=logging.INFO)

bot = Bot(
    token=BOT_TOKEN,
    default=DefaultBotProperties(parse_mode="HTML")
)
dp = Dispatcher()

# Register middleware
dp.message.middleware(DbSessionMiddleware())
dp.callback_query.middleware(DbSessionMiddleware())

# Register routers
dp.include_router(start.router)
dp.include_router(menu.router)
dp.include_router(upload.router)
dp.include_router(files.router)

async def main():
    logging.info("Bot is running successfully!")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
```

## What We Learned

Building this bot taught us several valuable lessons:

1. **Aiogram 3.x** is much cleaner than version 2.x with better async support. The framework is going towards the FastAPI philosophy.
2. **FSM states** make complex user interactions manageable.
3. **SQLAlchemy async** requires careful session management.
4. **File type detection** through MIME types is more reliable than extensions.
5. **Middleware** is perfect for cross-cutting concerns like database sessions.

### Potential Improvements

If we were to extend this bot, we'd add:
- File size limits and validation
- User storage quotas
- File sharing between users
- Search functionality

### Running the Project

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Set up PostgreSQL database
4. Configure `.env` file
5. Run migrations: `alembic upgrade head`
6. Start the bot: `python main.py`

That's it! You now have a fully functional file manager bot. The code is clean, scalable, and ready for test! Here is the working repository: [GitHub](https://github.com/Almond2107/File_keeper_telegram_bot)

Happy coding! 
