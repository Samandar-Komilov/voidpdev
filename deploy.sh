#!/bin/bash
set -e

cd /home/django/voidpdev

echo "[+] Pulling latest code"
git pull origin master

echo "[+] Synchronizing dependencies using `uv sync`"
uv sync

echo "[+] Activating virtual environment"
source .venv/bin/activate

echo "[+] Applying migrations"
python manage.py migrate --noinput

echo "[+] Collecting static files"
python manage.py collectstatic --noinput

echo "[+] Restarting Gunicorn"
sudo systemctl restart gunicorn_voidpdev
