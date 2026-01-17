---
title: "Two Scoops of Django 3: My Conclusions"
description: "My conslusions on reading the book, usages of best-practices and possible problems to avoid."
date: 2025-10-11
categories:
  - Python
tags:
    - Python
    - Django
---

My conslusions on reading the book, usages of best-practices and possible problems to avoid.

<!-- more -->

### Chapter 1: Coding Style

**Readability**. What this means is that you should go the extra mile to make your code as readable as possible:

- Avoid abbreviating variable names.
- Write out your function argument names.
- Document your classes and methods.
- Comment your code.
- Refactor repeated lines of code into reusable functions or methods.
- Keep functions and methods short. A good rule of thumb is that scrolling should not be necessary to read an entire function or method.

**PEP 8**. Use pre-commit and `ruff` linter's default configurations to follow common PEP8 rules, such as:

- 79 character length
- no star imports
- group imports by: standard-library, third-party, local
- prefer absolute imports over relative
- use underscores in URL patterns over dashes
- don't call functions or evaluate expressions inside of string interpolation:

```python
# Allowed
f"hello {user}"
f"hello {user.name}"
f"hello {self.user.name}"

# Disallowed
f"hello {get_user()}"
f"you are {user.age * 365.25} days old"

# Allowed with local variable assignment
user = get_user()
f"hello {user}"
user_days_old = user.age * 365.25
f"you are {user_days_old} days old"
```

- Follow other guides shown [here](https://docs.djangoproject.com/en/5.2/internals/contributing/writing-code/coding-style/)
- Follow [PEP257](https://peps.python.org/pep-0257/) for docstrings


### Chapter 2: The Optimal Django Setup

1. Don't use SQLite in production. It is treated as a file and does not support concurrency as postgres or similar database servers support.
2. Use a modern, production-ready package managers, such as `uv`.
3. Prefer `Docker` or similar containerization tool over raw systemd service.


### Chapter 3: How to Layout Django Projects

1. Use a cookiecutter or build your own boilerplate.


### Chapter 4: Django App Design

1) Each app should be tightly focused on its task.

2) Common app modules:

```
# Common modules
app1/
├── __init__.py
├── admin.py
├── forms.py
├── management/
├── migrations/
├── models.py
├── templatetags/
├── tests/
├── urls.py
├── views.py
```

3) Uncommon app modules:

```
# uncommon modules
app1/
├── behaviors.py
├── constants.py
├── context_processors.py
├── decorators.py
├── db/
├── exceptions.py
├── fields.py
├── factories.py
├── managers.py
├── middleware.py
├── schema.py
├── signals.py
├── utils.py
├── viewmixins.py
```
The purpose of these files are:

- `behaviors.py` - An option for locating model mixins;
- `constants.py` - A good name for placement of app-level settings;
- `decorators.py` - Where we like to locate our decorators;
- `db/` - A package used in many projects for any custom model fields or components;
- `fields.py` - is commonly used for form fields but is sometimes used for model fields when there isn’t enough field code to justify creating a `db/` package;
- `factories.py` - Where we like to place our test data factories;
- `managers.py` - When `models.py` grows too large, a common remedy is to move any custom model managers to this module;
- `schema.py` This is where code behind GraphQL APIs is typically placed;
- `signals.py` - While we argue against providing custom signals, this can be a useful place to put them;
- `utils.py` - utility functions;
- `viewmixins.py` - View modules and packages can be thinned by moving any view mixins to this module.

4) Alternatively, we can use **service layer** approach (I personally prefer independent functions to perform business logic, as they are testable and reusable).


### Chapter 5: Settings and Requirements Files

Some best practices to follow:

- **All settings files need to be version-controlled.** This is especially true in production environments, where dates, times, and explanations for settings changes absolutely must be tracked.
- **Don’t Repeat Yourself.** You should inherit from a base settings file rather than cutting-and-pasting from one file to another.
- **Keep secret keys safe.** They should be kept out of version control.

**Using Multiple Settings Files.** Instead of having one `settings.py` file, with this setup you have a `settings/` directory containing your settings files. This directory will typically contain something like the following:
```
settings/
├── __init__.py
├── base.py
├── local.py
├── staging.py
├── test.py
├── production.py
```
Configure `DJANGO_SETTINGS_MODULE` to declare which settings file to use.

**Using Environment Variables Pattern.** Every operating system supported by Django (and Python) provides the easy capability to create environment variables. PLEASE use them. Everything - API keys, secret keys, credentials, etc - should be stored in environment variables.

1. Setting environment variables locally:
```bash
export SOME_SECRET_KEY=1c3-cr3am-15-yummy
```

2. Unsetting environment variables locally:
```bash
unset SOME_SECRET_KEY
```

**Setting Environment Variables in Production.** In production, we have to use `.env` file with a proper library, such as `django-environ` or `python-dotenv` to automatically manage environment variables. 

**Handling Missing Key Exceptions.** By default, if we use `python-dotenv` or `django-environ` and do not find a key in the `.env` file, it will raise an exception, but doesn't tell exactly which key is not present. In this case, we can define a simple utility function to make it explicit:
```python
# settings/base.py
import os
# Normally you should not import ANYTHING from Django directly
# into your settings, but ImproperlyConfigured is an exception.
from django.core.exceptions import ImproperlyConfigured

def get_env_variable(var_name):
    """Get the environment variable or return exception."""
    try:
        return os.environ[var_name]
    except KeyError:
        error_msg = 'Set the {} environment variable'.format(var_name)
        raise ImproperlyConfigured(error_msg)
```
Then we can use it to get our secret key:
```python
SOME_SECRET_KEY = get_env_variable('SOME_SECRET_KEY')
```
This will ensure we will be notified about which key is not present exactly with a proper django exception.


### Chapter 6: Model Best Practices

**Be Careful With Model Inheritance.** Model inheritance in Django is a tricky subject. Django provides three ways to do model inheritance: _abstract base classes_, _multi-table inheritance_, and _proxy models_. Don't confuse Python's Abstract Base Classes with Django's Abstract models, they are different.

!!! warning
    Avoid using **Multi-Table Inheritance** as it is considered bad by general community.

Here are some simple rules of thumb for knowing which type of inheritance to use and when:

- No Model Inheritance, if the overlap between models is minimal (one or two fields are common). Just add the fields to both models.
- Abstract Base Classes, If there is enough overlap between models that maintenance of models’ repeated fields cause confusion.
- Proxy Models, are an occasionally-useful convenience feature, but they’re very different from the other two model inheritance styles. (But I think we should avoid it too).
- Multi-table Inheritance, AVOID!

---

### Reference

- [Two Scoops of Django by Audrey Roy](https://daniel.feldroy.com/posts/two-scoops-of-django-3.x)