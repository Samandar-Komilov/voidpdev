---
title: "React | Under The Hood"
date: 2025-07-12
categories:
  - Frontend
tags:
  - js
  - react
  - fundamentals
---


This markdown document is my summary of how React works under the hood, to clarify the "black box" working of it and also browsers. 

<!-- more -->

## What is React?
React is a JavaScript Library for building user interfaces, developed by Facebook. It solves the problem of loading the same HTML pages repeatedly even if a small change occurs in the page. To achieve this, it uses Virtual DOM.

## How to install it?
React can be installed and used in two major ways:
1. With a custom setup using tools like **Vite**
2. With a fullstack framework like **Next.js**

Use **Vite** if:
- you want to learn React itself deeply
- you already have backend like in Django/FastAPI

Use **Next.js** if:
- you want JS-only full stack app

Let's uncover each option in detail.

### 1️⃣ Manual Setup using Vite
Installation steps:
```bash
# Install npm if not already
npm install -g npm@latest

# Create a new Vite project
npm create vite@latest my-react-app -- --template react
cd my-react-app

# Install dependencies
npm install

# Run development server
npm run dev
```
Project structure:
```
my-react-app/
├── index.html          ← Entry HTML
├── package.json        ← NPM config
├── src/
│   ├── main.jsx        ← Entry JS file
│   └── App.jsx         ← Your first component
├── public/             ← Static assets
```
To create a production-ready static bundle:
```bash
npm run build
```
This generates a `dist/` folder with static files (`index.html`, `assets/`) that can be deployed anywhere (e.g., GitHub Pages, Netlify, nginx, etc.)

### 2️⃣ Using Next.js
Installation steps:
```bash
# Create a new Next.js app
npx create-next-app@latest my-next-app

cd my-next-app

# Run development server
npm run dev

```
Project Structure:
```bash
my-next-app/
├── pages/
│   ├── index.js        ← Home page
│   └── api/            ← API routes (backend code)
├── public/             ← Static assets
├── styles/             ← Global and component styles
├── next.config.js      ← Config file
```
Build and Deploy:
```bash
npm run build
npm start
```
Or deploy easily to Vercel (official host for Next.js).

---

Okay, let's start the real discussion now.

## What are npm, npx and yarn? Why we need them?
- `npm` is a package manager for Node.js, just like pip for Python. 
- `npx` runs a package without installing it globally (like `uv run` in Python).
- `yarn` is an alternative to `npm`, faster and better dependency caching.

## Why we need to "Build" the projects? Aren't we using JS and it's interpreted language?
Yes, JS runs in the browser unless you are using Node.js. But the browser does not understand your JSX syntactic sugar, new ES6 features, TypeScript code, etc. So, we need a build tool like **Vite** to bundle our code into browser-compatible code. So, the things **Vite** does:
- JSX -> JS: like compiling .py to .pyc
- TS -> JS: again like compiling .py to .pyc
- bundling: Like creating one big .py file with all imports
- minification: Like stripping comments and whitespace
- transpiling: Like rewriting Python 3.10 code to 3.6-compatible

So yes — React is JS and it runs in an interpreter (browser), but it needs to be transformed into browser-friendly code before being deployed.

## React Official Doc says we can deploy React apps as static without any server, but how?
Because React apps run entirely in the browser after being built. You write `.jsx` and `.js`. Vite/Webpack compiles it into:
```
dist/
├── index.html
├── assets/
│   ├── main.js     <-- your bundled React code
│   └── style.css   <-- optional
```
That’s it. So, everything you wrote becomes like a single static html-css-js setup.

## What is DOM and React DOM? Is this how React works?
**HTML DOM** is like a tree structure of our HTML page - every tag we create is a node. (We can try parsing HTML pages and build our own tree structure, that's not that hard :)). Then the browser builds this DOM when it reads our HTML and we can manipulate it using JS:
```js
document.getElementById("title").innerText = "Hello!";
```

**React DOM** is React's interface to the actual DOM. React creates a **Virtual DOM** (an in-memory representation of the real DOM) and then calculates differences (*"diffing"*) and updates only what changed.

### Well, who cares? How it solves the full page reload problem?
As we observed while building nginx-clone, every time a new HTTP request is sent, we resent the whole page again and again. Of course, I think still nginx does the same right now too, likely using `sendfile()` kernel function instead of copying the whole HTML page to user-space buffer, however we need some way to deal with this without sending request to backend. And here React comes.
React solves this using two key ideas:
1. **Virtual DOM (VDOM)**
React creates a copy of the real DOM in memory. Whenever your component state/props change, React generates a new virtual DOM. Now it has:
    - oldVDOM (before state change)
    - newVDOM (after state change)

2. **DOM Diffing Algorithm**
React runs a diff algorithm between old and new virtual DOMs. Figures out what exactly changed. A single `<li>` added? Just a text changed? A button style updated?

React then avoids deleting and recreating everything. It updates only the actual part of the real DOM (browser) that changed. Like how Git works — instead of storing a new copy of the whole repo, it stores diffs.

## State is local to the browser, okay. But what is the browser in OS terms actually? Where the state as said "local" are stored?
Browser is multi-process OS-level application with complex memory management, rendering stacks, and IPC systems. It manages:
- Rendering engines
- JavaScript runtime
- Networking
- Storage
- UI
- Security (sandboxing)

All working together with **IPC**, **shared memory**, **GPU access**, and more.

Here's how Chrome and most modern browsers structure things:
```
Browser Process (main)
├── Renderer Process #1 (for tab 1)
├── Renderer Process #2 (for tab 2)
├── GPU Process (shared for all)
├── Network Process
├── Extension Process (optional)
└── Utility/Crash Reporter, etc.
```
Browser Process is the main process, managing tabs, UI, IPC Routing and etc. Renderer processes render HTML/CSS/JS in each tab. Network process manages HTTP connections, sockets and cache. 

### So, where does the Virtual DOM is stored?
HTML and CSS DOM is typically stored in Renderer process memory (according to my research, tell if I'm wrong). JavaScript Heap is also located in Renderer process, inside JS engine like V8. Basically, each process has its own virtual memory space. IPC occurs via shared memory, mojo (Chromium IPC layer) or raw sockets/pipes.