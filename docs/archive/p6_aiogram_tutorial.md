---
title: "Aiogram 3 - Developer's Guide"
description: "No bloated docs, no endless YT videos. Simple, short, in-place guide."
date: 2025-09-05
categories:
  - Backend
tags:
    - python
---



This tutorial is designed for classroom use with students learning to build Telegram bots using aiogram 3.

<!-- more -->

# Aiogram 3.x — Developer's Guide

This tutorial is designed for classroom use with students learning to build Telegram bots using **aiogram 3.x**. Each step introduces a key feature with explanation, examples, and interactive exercises.

---

## Step 0 — Setup & Tiny Echo Bot

**Goal:** Get everyone a working bot.

```bash
python -m venv .venv
source .venv/bin/activate
pip install aiogram==3.22.0
```

**Example:**

```python
import asyncio
from aiogram import Bot, Dispatcher
from aiogram.filters import Command
from aiogram.types import Message

BOT_TOKEN = "YOUR_TOKEN"

async def main():
    bot = Bot(BOT_TOKEN)
    dp = Dispatcher()

    @dp.message(Command("start"))
    async def start(m: Message):
        await m.answer("Hello! Send me anything, I’ll echo it.")

    @dp.message()
    async def echo(m: Message):
        await m.answer(m.text or "Got your message!")

    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
```

**Exercise:** Run the bot and confirm it echoes text.

---

## Step 1 — Dispatcher, Routers, Modular Handlers

**Why?** Organize large projects by splitting features.

**Example:**

```python
# routers/start.py
from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import Message

router = Router()

@router.message(CommandStart())
async def start(m: Message):
    await m.answer("Welcome!")
```

```python
# main.py
from aiogram import Bot, Dispatcher
from routers import start

bot = Bot("TOKEN")
dp = Dispatcher()
dp.include_router(start.router)
await dp.start_polling(bot)
```

**Exercise:** Split the echo bot into `routers/echo.py`.

---

## Step 2 — Filters & `F` Expressions

**Why?** Catch exactly the messages you want.

**Example:**

```python
from aiogram import F

@router.message(F.photo | F.document)
async def media_handler(m: Message):
    await m.answer("Nice media!")
```

**Exercise:** Add handler for text longer than 10 chars.

---

## Step 3 — Keyboards (Reply & Inline)

**Reply keyboards** insert text; **Inline keyboards** attach actions.

**Example:**

```python
from aiogram.utils.keyboard import InlineKeyboardBuilder

builder = InlineKeyboardBuilder()
builder.button(text="Work", callback_data="cat:work")
builder.button(text="Personal", callback_data="cat:personal")
builder.adjust(2)
await message.answer("Choose: ", reply_markup=builder.as_markup())
```

**Exercise:** Build a 3×2 inline keyboard.

---

## Step 4 — CallbackData

**Why?** Safer structured callback payloads.

**Example:**

```python
from aiogram.filters.callback_data import CallbackData

class FileCb(CallbackData, prefix="file"):
    action: str
    file_id: int

@router.callback_query(FileCb.filter())
async def on_file_action(cb: CallbackQuery, callback_data: FileCb):
    await cb.answer(f"Action {callback_data.action} on {callback_data.file_id}")
```

**Exercise:** Create Delete/Rename buttons using `FileCb`.

---

## Step 5 — FSM (Finite State Machine)

**Why?** Handle multi-step flows.

**Example:**

```python
from aiogram.fsm.state import State, StatesGroup
from aiogram.filters import StateFilter

class Upload(StatesGroup):
    waiting_for_file = State()
    waiting_for_category = State()

@router.message(Command("upload"))
async def start_upload(m: Message, state: FSMContext):
    await m.answer("Send me a file.")
    await state.set_state(Upload.waiting_for_file)

@router.message(StateFilter(Upload.waiting_for_file))
async def got_file(m: Message, state: FSMContext):
    await state.update_data(file_id=m.document.file_id)
    await m.answer("Choose category.")
    await state.set_state(Upload.waiting_for_category)
```

**Exercise:** Create `/survey` that asks two questions.

---

## Step 6 — Middlewares & Dependency Injection

**Why?** Inject DB sessions, configs, etc.

**Example middleware:**

```python
from aiogram import BaseMiddleware

class DBSessionMiddleware(BaseMiddleware):
    async def __call__(self, handler, event, data):
        async with async_sessionmaker() as session:
            data["session"] = session
            return await handler(event, data)
```

**Exercise:** Middleware that injects `request_id` into handlers.

---

## Step 7 — File Handling (Telegram specifics)

* Telegram gives **file\_id**: store & resend.
* To get best photo: `m.photo[-1].file_id`
* To send back: `await m.answer_document(file_id)`

**Exercise:** Receive a file, store `file_id` in memory, resend with `/get`.

---

## Step 8 — Async DB Integration

**Pattern (SQLAlchemy async):**

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

engine = create_async_engine("sqlite+aiosqlite:///db.sqlite3")
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
```

Use middleware to inject `session: AsyncSession` into handlers.

**Exercise:** Create `users` table, save new user on `/start`.

---

## Step 9 — Deployment: Polling → Webhooks

* **Polling:** good for dev.
* **Webhooks:** required for production, faster & efficient.

**Pattern:**

```python
await bot.set_webhook("https://example.com/webhook")
```

**Exercise:** Demo FastAPI app forwarding updates to `dp.feed_update(...)`.

---

## Step 10 — Testing & Pitfalls

**Tips:**

* Always `await session.commit()`.
* Always `await state.clear()` when FSM flow finishes.
* Debug callback data by logging `callback_query.data`.

**Homework:** Build mini file manager bot: upload, list, delete.

---

# Final Project Milestones

* **Midterm:** Upload flow storing file\_id + category in SQLite.
* **Final:** File Keeper Bot with CRUD (rename, delete, paginate) and webhook deployment.
