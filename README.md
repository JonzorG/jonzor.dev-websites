# jonzor.dev & files.jonzor.dev

This repository contains the source code and Docker configuration for my personal portfolio and file-sharing subdomain. 

Everything is self-hosted on my home Linux server. I use Cloudflare Tunnels to securely expose the containers to the internet without opening ports on my router. I made this repo public mostly so I could link to it from my portfolio as an example of my infrastructure setup. It's not really built to be a plug-and-play template for other people to deploy, but feel free to poke around the code.

## The Setup

The stack is orchestrated with Docker Compose, running an Apache server (`my-httpd.conf`) that handles routing for two main sites:

### 1. Main Portfolio (`jonzor.dev`)
My personal website detailing my background as an M.Sc. Software Engineering student at BTH, along with my skills and current projects. Kept it lightweight with vanilla HTML, CSS, and JS.

### 2. File Directory (`files.jonzor.dev`)
A subdomain I use to easily share files.
* **Study Materials:** I host old exams and notes.
* **Markdown Viewer:** I wrote a custom Markdown parser/viewer in JavaScript.
* **Misc:** Random builds and side projects (like a mobile game `.apk`).

*(Note: The actual hosted files and assets are excluded from this public repo via `.gitignore` so I can swap them out directly on the server).*

## Tech Stack
* **Frontend:** HTML / CSS / Vanilla JS
* **Web Server:** Apache (`httpd`)
* **Infrastructure:** Docker / Docker Compose, Self-hosted Linux server, Cloudflare Tunnels
