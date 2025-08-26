---
title: "UV package manager & Ruff Formatter - User Guide"
description: "Everything about switching from pip & requirements.txt to uv & pyproject.toml"
date: 2025-07-09
categories:
  - Productivity
tags:
  - python
  - tools
---


This guide helps you modernize your Python tooling using [`uv`](https://github.com/astral-sh/uv) and [`ruff`](https://github.com/astral-sh/ruff). 

<!-- more -->

It focuses on common real-world use cases such as migration from legacy setups, handling multiple Python versions, formatting code, and integrating tools into development workflows.

### 📚 Table of Contents
- introduction to `uv`
- migrating from raw `pip` & `requirements.txt` to `uv` & `pyproject.toml`.
- managing multiple python versions (old codebases)
- introduction to `ruff`
- ruff configuration in `pyproject.toml`
- useful `ruff` commands

### 🔗 References
- UV official documentation: https://github.com/astral-sh/uv/
- Ruff official documentation: https://docs.astral.sh/ruff/
- RealPython article on UV: https://realpython.com/python-uv/
- RealPython article on Ruff: https://realpython.com/ruff-python/

---

## ⚡ UV: Fast Python Package Manager

### Introduction to UV

`uv` is a blazing-fast Python package manager and virtual environment manager developed by [Astral](https://astral.sh/). It replaces tools like `pip`, `virtualenv`, `pip-tools`, and even `pyenv`, providing:

- Fast dependency resolution
- Built-in virtualenv management
- Support for multiple Python versions
- `npx`-like tool execution via `uv run`

### Installation

Install uv using either `pip` or `curl`:
```bash
$ curl -LsSf https://astral.sh/uv/install.sh | sh
# or
$ pipx install uv
# or
$ pip install uv
```

To update uv, run `uv self upgrade` or `pipx upgrade uv` depending on how you installed it:

```bash
$ uv self upgrade
# or
$ pipx upgrade uv
# or
$ pip install --upgrade uv
```

### Quick Start

1. Create a new project using `uv init`:
```bash
$ uv init uvtest
```
The command creates the following directory structure under the uvtest/ folder:
```bash
uvtest/
│
├── .git/
├── .gitignore
├── .python-version
├── README.md
├── main.py
└── pyproject.toml
```

You can explore that it generates a README file, `pyproject.toml` file, `main.py` file which contains a simple example, and initializes a git repository with `.gitignore` file. This is cool!

Let's look at `pyproject.toml` file:
```toml
[project]
name = "uvtest"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.13"
dependencies = []
```
A single file now manages your project's dependencies and configuration. But where is my virtual environment? Don't hurry, it will be generated once you add a new dependency:
```bash
$ uv add requests
```
This command installs the package into the virtual environment and updates `pyproject.toml` with the new dependency:
```toml
[project]
name = "uvtest"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.13"
dependencies = ["requests"]
```
In order to lock your dependencies, run `uv lock`:
```bash
$ uv lock
```
Now, your `pyproject.toml` file is ready for deployment. The locked dependencies ensure consistent environments across different users and machines.

### Migrating from existing legacy projects

Existing legacy projects use conventional and raw `pip` with `requirements.txt` and maybe `pip-tools` with `requirements.in`. Anyways, `uv` is here to help you modernize your Python tooling. You can migrate your projects step-by-step using the following steps:

1. **Open the existing project folder and initialize uv:**
    This command will create the uv project structure for you. It won’t overwrite the `main.py` file if you have one, but it’ll create the file if it’s missing. It neither modifies your Git repository nor your `README.md` file. 
    However, this command won’t work if you already have a `pyproject.toml` file in place. If that’s the case, then you can move the file to another location and run the `uv init` command. Finally, you can update the new file with any relevant configuration from your old `pyproject.toml`.
    ```bash
    uv init
    ```
2. **Export existing dependencies:**
    In order to synchronize the current dependencies with `uv`, we have to first export them to a `requirements.txt` file if not already done:
    ```bash
    pip freeze > requirements.txt
    ```
3. **Add dependencies using uv:**
    The following command adds all dependencies to `uv` which then automatically updates the `pyproject.toml` file:
    ```bash
    uv add -r requirements.txt
    ```
4. **Lock dependencies:**
    The following command locks the dependencies in the `pyproject.toml` file:
    ```bash
    uv lock
    ```

That's it! You now have a modern Python tooling setup that is easy to use and maintain.

If you want to remove a dependency, you can use the `uv remove` command:
```bash
uv remove requests
```
And if you want to update a dependency, you can use the `uv update` command:
```bash
uv update requests
```

**Managing Dev Dependencies**
In most development environments, you’ll have dependencies that aren’t required for running the code but are vital for developing it. For example, testing libraries like pytest, code formatters like Ruff, and static type checkers like mypy might be some of these development dependencies.
The following command adds the development dependency as a separate group:
```bash
uv add --dev pytest
```
If you check the content of pyproject.toml after running the command above, then you’ll find the following:
```toml
[project]
name = "uvtest"
version = "0.1.0"
description = "UV Test Project Description"
readme = "README.md"
requires-python = ">=3.13"
dependencies = [
    "requests>=2.32.3",
]

[dependency-groups]
dev = [
    "pytest>=8.3.5",
]
```

**Locking and Syncing**
We have already seen that the `uv lock` command locks the dependencies in the `pyproject.toml` file to a separate file called `uv.lock`. This file is used by the `uv sync` command to synchronize the dependencies in the `pyproject.toml` file with the ones in the `uv.lock` file. It helps to new developers to have a consistent, synchronized setup.

So, a new developer just does:
```bash
uv sync
```
And then they can start working on the project.

### Managing Multiple Python Versions

`uv` installs Python and allows quickly switching between versions. You can install multiple versions of python using the following command:
```bash
$ uv python install 3.10 3.11 3.12
```

Create a new virtual environment using a specific Python version:
```bash
$ uv venv --python 3.10
```

You can also pin a specific Python version in the current directory:
```bash
$ uv python pin 3.10
```

You can find more [here](https://docs.astral.sh/uv/guides/install-python/).

### Conclusion: Commands we used so far

- `uv init`: Initialize a new uv project
- `uv add`: Add a dependency to the project
- `uv remove`: Remove a dependency from the project
- `uv update`: Update a dependency in the project
- `uv lock`: Lock the dependencies in the project
- `uv sync`: Synchronize the dependencies in the project with the ones in the lock file
- `uv self upgrade`: Upgrade uv to the latest version
- `uv python install`: Install a specific Python version
- `uv python pin`: Pin a specific Python version in the current directory
- `uv venv`: Create a new virtual environment
- `uv run`: Run a command in a virtual environment

---

## ✨ Ruff: The Fast Python Linter & Formatter

### Introduction to Ruff
`ruff` is a fast, Rust-based linter and formatter for Python that replaces tools like:
- flake8
- isort
- pylint
- pycodestyle
- black

It supports over 500 rules and is highly configurable.

The recommended way to install `ruff` and integrate to your project is using `uv`:
```bash
$ uv add --dev ruff
# or, if you want it to install user-wide in your system
$ uv tool install ruff
```

Using ruff is easy. To check for formatting and linting errors, just run:
```bash
$ ruff check
# or if you want to fix fixable errors along the way:
$ ruff check --fix
```

The check command can generate several errors with vague messages. To get more information, you can find the ruff rule description:
```bash
$ ruff rule F821
```

**Continuous Linting.** To have continuous linting as you code, open a new terminal window and pass the --watch flag to the check command:
```bash
$ ruff check --watch
```
This will watch for any linting errors as you write your code, in real time!

**Formatting Python Code.** By default, Ruff has sensible formatting rules and was designed to be a drop-in replacement for Black. The following command automatically formats your code on desired directory (current directory if not specified):
```bash
$ ruff format
```
Just like the `check` command, the format command takes optional arguments for a path to a single file or directory.

### Configuring Ruff
We need a configuration file to manage Ruff's rules. There are 2 options for us:
- separate `ruff.toml` file
- ruff config directly in `pyproject.toml`

Let's consider a sample configuration file `ruff.toml`:
```toml
[tool.ruff]
line-length = 79    # PEP 8 recommended line length
select = ["E", "F", "B", "I"]  # Equivalent to flake8 + isort + bugbear
ignore = ["E203", "E266", "E501", "W503", "F403", "F401"]  # From our old flake8 config
exclude = [
  ".git", ".mypy_cache", ".pytest_cache", ".tox", ".venv", "venv", ".env", "env",
  ".vscode", "static", "media", "templates", "developments", "scripts",
  "requirements", "*/templates/*", "*/migrations/*"
]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
line-ending = "lf"
```