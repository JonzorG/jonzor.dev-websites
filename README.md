# jonzor.dev, files.jonzor.dev & imposter.jonzor.dev

This repository contains the source code and Docker configuration for my personal portfolio, file-sharing subdomain, and web games. 

Everything is self-hosted on my home Linux server. I use Cloudflare Tunnels to securely expose the internal Docker network to the internet without opening any ports on my router. I made this repo public mostly so I could link to it from my portfolio as an example of my infrastructure setup. It's not really built to be a plug-and-play template for other people to deploy, but feel free to poke around the code.

## The Setup

The stack is orchestrated with Docker Compose, running isolated Nginx and Apache containers that serve three main sites through a single Cloudflare Tunnel:

### 1. Main Portfolio (`jonzor.dev`)
My personal website detailing my background as an M.Sc. Software Engineering student at BTH, along with my skills and current projects. Kept it lightweight with vanilla HTML, CSS, and JS.

### 2. File Directory (`files.jonzor.dev`)
A subdomain I use to easily share files.
* **Study Materials:** I host old exams and notes.
* **Markdown Viewer:** I wrote a custom Markdown parser/viewer in JavaScript.
* **Misc:** Random builds and side projects (like a mobile game `.apk`).

*(Note: The actual hosted files and assets are excluded from this public repo via `.gitignore` so I can swap them out directly on the server).*

### 3. Imposter Game (`imposter.jonzor.dev`)
A lightweight, mobile-first "pass-the-phone" party game. Built with pure Vanilla HTML, CSS, and JS, relying on local state management and array shuffling to assign secret words and roles to players offline. 

## Tech Stack
* **Frontend:** HTML / CSS / Vanilla JS
* **Web Servers:** Nginx & Apache (`httpd`)
* **Infrastructure:** Docker / Docker Compose, Self-hosted Linux server, Cloudflare Tunnels
