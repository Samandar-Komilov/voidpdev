---
title: "Introduction to Linux: The Big Picture and Basic Commands"
description: "Mastering any skill requires to start from scratch. Let's do the same with Linux: ls -la!"
date: 2025-06-01
categories:
  - Linux
tags:
    - linux
---

Mastering any skill requires to start from scratch. Let's do the same with Linux: ls -la!

<!-- more -->

## The Big Picture

!!! question "Question"
    Well, you are using Linux for N+ years. But you still don't know **How Linux works?**

The most effective way to understand how an operating system works is through an **abstraction**. We can divide Linux Operating System into 3 layered abstractions:

* User Processes
* Kernel
* Hardware

### Main Memory
Main memory is just a huge storage for numerous 0s and 1s, called bits. This is where all programs, including the kernel itself, are stored. A CPU is just an operator on memory - it reads instructions from memory, performs computations (using its registers) and writes the result back to the memory.

**State.** A state is a particular arrangement of 0s and 1s at specific time. This means, `0110`, `0010` and `0001` are different states even if they are in the same time frames. A process is also a state consisting millions of bits. So, it is very hard to memorize what state it is and was, so we again make it abstract:
```md
❌ The process is in state `0110 0001 0011 1101 1111`
✅ The process is **waiting for input**.
```

### Kernel
The kernel has a number of definitions. Here's 2 of them:

* Kernel is an interface between hardware and processes.
* Kernel is a software that tells CPU where to look for the next task.

Kernel has a number of responsibilities:

* **Process scheduling:** Which process is allowed to use CPU at any given time.
* **Memory Management:** which memory is of which process, which memory is shared, which are being allocated and freed, etc.
* **Device drivers:** Managing specific hardware interfaces.
* **System call support:** User processes can call kernel functions using syscalls.

### User Space
User space is a memory area allocated by kernel for user processes. Recall that a process is simply a state of memory.

Linux supports User management. But why it needs a user? Users exists primarily to support **permissions** and **boundaries**. Every user-space process has *owner*, and any user can only access and modify the process owned by them. 
**Root user** has unrestricted access however. Root user can easily modify any process, no matter who owns that. System designers always try root access as less required as possible. For instance, what if simply turning on Wi-Fi would require root access (as it is a hardware feature). That would be a security hole!

## Basic Commands and Directory Structure

### Standard Input and Standard Output
Unix processes use I/O streams to read and write data. Streams are very flexible: a source of an input stream can be a file, a device, a terminal window or even the output stream of the another process. To observe this, simply type `cat` and press `ENTER`. The program starts to wait for your input from input stream to do its work, as you didn't specify from which file it should read. So, in this case Terminal's output stream is being cat's input stream.

### Basic Commands
- `cat /etc/passwd`
- `cat file1.conf file2.txt`
- `ls -l`
- `cp file1.txt file2.txt` - file1 is copied into file2
- `cp file dir` - file is copied into dir
- `cp file1 file2 file3 dir` - multiple files are copied into dir
- `mv file1 file2` - renames file1 as file2
- `touch file` - creates a file
- `ls -l file` - shows file information with permissions
- `rm file` - removes the file
- `wc file` - counts lines, words, and bytes (`-l -m -c` flags respectively)

### Navigating Directories
- `cd dir` - changes current directory to dir (opens dir)
- `mkdir dir` - makes a new dir
- `rmdir dir` - removes the dir

### Shell Globbing (Wildcards)
Shell can match simple patterns to file and directory names. 

- `echo *` - any number of arbitrary characters (lists files in a current directory)
- `("msg*", "*msg", "*msg*")` - `[0]` expands to all filenames that start with msg, `[1]` expands to all filenames end with msg, `[3]` expands to all filenames contain msg
- `br?t` - `?` glob expands to exactly 1 character - matching `brat` and `brot` in this example

### Intermediate Commands
- `grep root /etc/passwd` - prints the lines from a file or input stream that match an expression. Here, it prints lines in `/etc/passwd` file that contain text root
    - `grep -i` - matches case-insensitive
    - `grep -v` - inverts the search (lists not matching)
    - grep understands regex: 
	- `grep root /etc/.*` - matches any number of chars, including none.
    	- `grep root /etc/.+` - matches any one or more chars.
	- `grep root /etc/.` - matches exactly one arbitrary char.
- `less file` - opens file with scroll option. Handy if a file or output stream is too big. For example, `grep ie /usr/share/dict/words | less` is giving all of the words containing `ie` as input stream to less, and it shows the result with scrolling option.
- `pwd` - print working directory
- `diff file1 file2` - see differences between 2 text files
- `file file` - let system guess the type of file
- `find dir -name file -print` - finds a file in directory dir and prints the location
- `head file.txt` - shows first 10 lines of the file. Use `-n` option to specify size
- `tail file.txt` - shows last 10 lines of the file. Use `-n` option to specify size
- `sort file` - sorts the file in alphanumeric order. `-r` for reverse, `-n` for sorting by numerical order only.


## User Management
In Unix-based systems you can create a new user as follows:
```bash
sudo useradd <user>     # adds user without /home/<user> directory
sudo useradd -m <user>  # adds user with /home/<user> directory
```
To change password of the user:
```bash
passwd <user>
```

To add a new group to the system:
```bash
sudo groupadd <group>
```
To add a user to the group:
```bash
sudo usermod -aG <group> <user>
```
To login as a new user:
```bash
su - <user>
# enter password
```

### Environment and Shell Variables
The shell can store temporary variables, called **shell variables**. For example:
```bash
$ STUFF=ls
$ $STUFF
# ... (ls)
```

An **environment variable** is a bit different. All processes on Unix systems have envvar storage. The primary difference is, evironment variables are accessible from any program ran by that shell (process), whereas shell variables can't be used with processes ran by that shell.
To assign an envvar:
```bash
STUFF=something
export STUFF
```

### The Command Path
PATH is a special envvar that contains a list of system dirs that shell searches when we type. For example, if we write `ls` on terminal, it searches the following dirs by default to find `ls` program:
```bash
ubuntu@ubuntu2404server:/etc$ echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
```
We also can tell the shell to look for other directories:
```bash
$ PATH=dir:$PATH
# or to append a dir
$ PATH=$PATH:dir
```

!!! warning
    Even if you wipe out your PATH accidentally, this change is local. Because envvars are stored locally in each process' address space, simply exiting the shell and opening a new one solves the problem.

### Input and Output
There are 3 types of streams in Unix: standard input, standard output and standard error. We can redirect the streams as we defined. For example:
```bash
command > file
command >> file
```
The former will redirect the output of `command` to file, strictly writing the file. The latter will also redirect, but appending to the existing contents of the file.

To send the standard output of a command to the standard input of another command, use the pipe character (`|`). The following example redirects the result of processes list to tail, showing only last 10 entries of the list:
```bash
ps -ax | tail
```
We may redirect the standard error into different location:
```bash
ls -a 2> error.txt
```

### Manipulating Processes
The `ps` command we emphasized earlier have several options to execute:
```bash
ps x   # show all of your running processes
ps ax  # show all processes not just yours
ps u   # include more detailed information about processes
ps w   # show full command names
```

## File Modes and Permissions
One of the most suffered topics for me. I just couldn't understand octal, hex notations of the permissions, based on user, group and other. Now, its time to reveal whats inside. Let's run `ls -l`:
```bash
ls -l

# drwxr-xr-x. 1 voidp voidp  74 May  6 01:34 samandar
# -rw-r--r--. 1 voidp voidp    201 Apr 22 19:11  exam.txt
```
The permissions column structured in this way:
`[file_type][user_permissions x3][group_permissions x3][other_permissions x3]` for example `-rwxrw-r--` means this is a regular file, the user can read, write, and execute, the group can read and execute, and other can read.
`drwxr-xr-x` means this is a directory, the user can read, write, and execute, the group can read and execute, and other can read.

**Modifying Permissions.**  
To change permissions on a file or directory, use the `chmod` command. We can change permissions for user, group and other:
```bash
chmod u+w file  # add write permission for user
chmod g+x file  # add execute permission for group
chmod o+r file  # add read permission for other
```

We can also change file permissions using numbers, in octal form. This might seem strange, and no need to remember every single one, but here are some examples:
```bash
chmod 744 file  # rwxr-xr-x
chmod 777 file  # rwxrwxrwx
chmod 644 file  # rw-r--r--
chmod 555 file  # rwxr-xr-x
chmod 755 file  # rwxr-xr-x
chmod 700 file  # rwx------
chmod 600 file  # rw-------
chmod 400 file  # r--------
chmod 200 file  # -w-------
chmod 100 file  # --x------
chmod 000 file  # ---------
```

**Symbolic Links.**  
A symbolic link is a file that points to another file or a directory, effectively creating an alias:
```bash
lrwxrwxrwx 1 ruser users 11 Feb 27 13:52 somedir -> /home/origdir
```
To create a symbolic link from target to linkname, use ln -s as follows:
```bash
ln -s target linkname
# For example:
ln -s /home/Desktop/Projects /home/Projects
```
> ⚠️ I need further explanation of this, couldn't get so much.


## Archiving and Compressing Files
When it comes to compressing files in Unix, GNU Zip or `gzip` comes to mind firstly:
```bash
gzip file         # compress file
gunzip file.gz    # decompress file
```
However, unlike ZIP programs in other operating systems, `gzip` does not pack multiple files into single compress, namely does not archive them. To do so, we use `tar`:
```bash
tar cvf archive.tar file1 file2 file3
# c - create mode, v - verbose diagnostic output, f - file option (.tar file name)
tar xvf archive.tar
# x - extract, v - verbose diagnostic output
```
**Using Table-of-Contents Mode**  
Before unpacking, it’s usually a good idea to check the contents of a `.tar` file with the table-of-contents mode by using the `t` flag instead of the `x` flag. This mode verifies the archive’s basic integrity and prints the names of all files inside. If you don’t test an archive before unpacking it, you can end up dumping a huge mess of files into the current directory, which can be really difficult to clean up.
```bash
tar tvf archive.tar
```
**Compressed Archives.**  
Compressed archives are just archives with a `.gz` extension:
```bash
tar zcvf archive.tar.gz file1 file2 file3
# z - gzip compression, c - create mode, v - verbose diagnostic output, f - file option (.tar file name)
tar zxvf archive.tar.gz
# z - gzip compression, x - extract, v - verbose diagnostic output

# or 2 separate commands:
gunzip archive.tar.gz
tar xvf archive.tar
```

---

## Exercises

1. Map Your Filesystem: Use `tree`, `ls`, `cd`, and `pwd` to draw (on paper or a text file) a hierarchy map of your home directory and `/etc`.  
2. Breadcrumb Trail: Navigate deep into `/usr`, then use `pwd` to echo your current path. Exit back step-by-step using `cd ..` only.  
3. Hidden Treasures: List all hidden files in your home directory. What do `.bashrc` and `.profile` do?  
    Answer: `.bashrc` is a configuration applied when we open a new bash shell. `.profile` is a configuration applied while logging into the system, either using SSH or other. It is a global configuration for all later opened shells.
4. Find Me If You Can: Use `find` to search for all `.conf` files under `/etc` (e.g., `find /etc -name "*.conf"`). Count them.
5. Directory Lab: Create a directory structure: `projects/linux/basics/{scripts,notes,logs}` using one command.
6. Log the Logs: Use `touch` to create 5 fake log files named `log1.log`, `log2.log`... etc., in the `logs` folder.
```bash
for i in {1..6}; do touch ./projects/linux/basics/logs/log$i.txt; done
```
7. Bulk Renamer: Rename all `.log` files to `.txt` using a `for` loop.
```bash
for i in {1..6}; do mv log$i.log log$i.txt; done
```
8. Copycat: Copy `/etc/hosts` and `/etc/resolv.conf` into your notes folder. Don’t overwrite existing ones.
9. Clean Sweep: Delete all `.txt` files in logs, but only after confirming their count.
10. Who’s Talking? Use `echo` to write a sentence to a file called `hello.txt`, then view it with `cat`, `less`, and `head`.
11. Copy & Compare: Duplicate a file and use `diff` to show they’re the same. Modify the copy slightly and compare again.
12. Combiner: Create 3 small `.txt` files with different content. Use `cat` to combine them into a new file.
```bash
cat file1.txt file2.txt file3.txt > res.txt
```
13. Line Count Challenge: Create a file with 20 lines. Use `wc`, `head`, and `tail` to count and extract specific lines.
```bash
wc -l etc_tree.txt
```
14. Output Redirect Mastery: Use `>` to write and `>>` to append to a file. Create a log tracking what you learn each day.
15. Man Page Explorer: Read the `man` page for `ls`, `grep`, `find`, and `bash`. Summarize one cool option for each.
16. Reverse Search Detective: Use `reverse-i-search (Ctrl+R)` to find a command you ran earlier. Re-run it.
```bash
# CTRL+R causes to open reverse-i-search window
(reverse-i-search)`u': while [true]; do
```
17. Your Command Diary: Use `history` to see your command list. Filter it using `grep` for commands like `cd`, `mkdir`, etc.
18. Get Me Help Fast: Use `--help` and `man` to learn the difference between `ls --help` and `man ls`.
    Answer: I concluded that `--help` is for usage details, command options. `man` is for full documentation.
19. Create a new user and group: 
    - Create a new user named `linuxuser` with the command `sudo useradd linuxuser`
    - Create a new group named `linuxgroup` with the command `sudo groupadd linuxgroup`
    - Add the `linuxuser` to the `linuxgroup` with the command `sudo usermod -aG linuxgroup linuxuser`
20. Create files and directories as the new user: 
    - Switch to the `linuxuser` account with the command `su - linuxuser`
    - Create a new directory named `mydir` in the `/home/linuxuser` directory
    - Create a new file named `myfile.txt` in the `mydir` directory
    - Create a new file named `anotherfile.txt` in the `/home/linuxuser` directory
21. Change ownership and permissions
    - Switch back to your original user account with the command `exit`
    - Change the ownership of the `mydir` directory to the root user with the command `sudo chown root:root /home/linuxuser/mydir`
    - Change the permissions of the `myfile.txt` file to read-only for the owner with the command `sudo chmod 400 /home/linuxuser/mydir/myfile.txt`
    - Try to edit the `myfile.txt` file as the `linuxuser` account with the command `su - linuxuser; nano mydir/myfile.txt` (you should get a permission denied error)
22. Change group ownership and permissions
    - Change the group ownership of the `anotherfile.txt` file to the `linuxgroup` group with the command `sudo chgrp linuxgroup /home/linuxuser/anotherfile.txt`
    - Change the permissions of the `anotherfile.txt` file to read-write for the group with the command `sudo chmod 660 /home/linuxuser/anotherfile.txt`
    - Try to edit the `anotherfile.txt` file as a member of the `linuxgroup` group with the command `su - linuxuser; nano anotherfile.txt` (you should be able to edit the file)
23. Use sudo to change ownership and permissions
    - Use `sudo` to change the ownership of the `mydir` directory back to the `linuxuser` account with the command `sudo chown linuxuser:linuxuser /home/linuxuser/mydir`
    - Use `sudo` to change the permissions of the `myfile.txt` file to read-write for the owner with the command `sudo chmod 600 /home/linuxuser/mydir/myfile.txt`
    - Try to edit the `myfile.txt` file as the `linuxuser` account with the command `su - linuxuser; nano mydir/myfile.txt` (you should be able to edit the file)

---

## References:
- [How Linux Works by Brian Ward](https://www.amazon.com/How-Linux-Works-Brian-Ward/dp/1718500408)