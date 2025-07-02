# 🧠 Readme-Gen

This repository contains the source code for a GitHub-powered web application that **generates and commits README.md files** to your repositories using **LLaMA3** (running locally). It’s built with **Django REST Framework** and **React**, using **GitHub OAuth** for authentication.

---

## Features

* Log in with GitHub (OAuth)
* Fetch and list your repositories
* Send repo contents to LLaMA3 for README generation
* Preview the generated README
* Commit the README directly to the repo with a single click
* No need for GitHub tokens — it uses the authenticated session

---

## Requirements

* Python 3.9+
* Django 5.2.3+
* Django REST Framework 3.16.0+
* Social-Auth App-Django 5.4.3+
* Social-Auth Core 4.6.1+
* Node.js + npm (for frontend)

---

## 📦 Installation

### Backend (Django + DRF)

1. Clone the repository:

   ```bash
   git clone https://github.com/Leander-Antony/readme-gen.git
   cd readme-gen
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Configure GitHub OAuth credentials in `settings.py`

4. Run migrations and start the server:

   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

---

### Frontend (React)

1. Go to the `frontend` folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Vite dev server:

   ```bash
   npm run dev
   ```

---

## 🔗 API Endpoints (Backend)

| Endpoint                              | Description                                             |
| ------------------------------------- | ------------------------------------------------------- |
| `POST /llama-readme/`                 | Sends repo content to LLaMA3 and gets README suggestion |
| `POST /commit-readme/<owner>/<repo>/` | Commits the README to GitHub                            |
| `GET /repo-list/`                     | Lists all repos of authenticated GitHub user            |

---


