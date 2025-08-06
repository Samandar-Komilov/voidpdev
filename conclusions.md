# Deployment Notes

I have Contabo Server with Ubuntu 24.04 and NameCheap domain. Now I want to deploy my django application to the server.


First, I ran the following commands:
```bash
sudo adduser django
sudo usermod -aG sudo django
```
**But what does it do?**
By default, when you SSH into your server with given credentials, you are root user, meaning you're superadmin. But it is not a good practice to deploy applications with root user in terms of security. So here, we created a dedicated user for our django projects using `adduser` command, which is better than `useradd` low-level command (creates directory in `/home`, sets permissions, etc. automatically). Then we added our user to the sudo group, which means that we can run commands as root user with sudo.

**Why do we need multiple settings files?**
Because some settings differ between development and production. Especially debug mode and allowed hosts. For this reason we created multiple `settings.py` files, made `DEBUG=False` in prod settings. And set up `ALLOWED_HOSTS` to allow `voidp.dev` domain access.

**If I'm deploying my app as systemd unit, not Dockerized, do I need to install PostgreSQL?**
Yes, of course. After installing postgresql, you have to configure it too.
- Once you install postgres to the machine, it creates a new `postgres` user in the system for isolation.
- Then you switch to that user (`sudo -i -u postgres`) and access `psql` shell.
- Then create a new database user, set password on it (e.g. `django`)
- Then create a database, grant needed privileges to it (`create database your_db with owner your_user; grant all priveleges on database your_db to your_user;`)
- You should then configure `pg_hba.conf` to allow your django application connection to the database with configured username and password. MD5 is an old algorithm, so you have to use SCRAM-SHA-256.
- If you are using database in a separate server and you have to connect to the db remotely, you need to:
    - allow firewall for 5432 port (to allow incoming network traffic to come to your db port)
    - configure `/etc/postgresql/<version>/main/postgresql.conf` to listen external addresses: `listen_addresses = '*'`
But since we are now using db and django in the same machine, we don't need it.


### GUNICORN-related configs happened ('ll write them soon)

### NGINX related configs