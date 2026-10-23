# CircularLoop — GitHub setup and local run

This folder is a cleaned, Git-ready source snapshot. Generated dependencies, local databases, caches, build output, and `.env` files were excluded. Recreate local dependencies using the commands below.

## 1. Configure environment files

From the repository root, copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env`. Edit the backend `SECRET_KEY` to a unique random value. Never commit either `.env` file. The example key is only a placeholder.

Windows CMD:

```cmd
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

## 2. Start the backend

```cmd
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Backend root: `http://127.0.0.1:8000/`
API docs: `http://127.0.0.1:8000/docs`
Health check: `http://127.0.0.1:8000/health`

## 3. Start the frontend in a second CMD window

```cmd
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite. The frontend API URL is configured by `VITE_API_URL` in `frontend/.env`.

## 4. Run checks

Frontend production build:

```cmd
cd frontend
npm run build
```

Frontend lint:

```cmd
npm run lint
```

Backend tests (run from the repository root after installing backend requirements):

```cmd
cd backend
python -m pytest
```

Note: tests and builds should be run in your local environment before treating this snapshot as verified.

## 5. Push this folder to GitHub

Create an empty repository on GitHub, then from this folder run:

```cmd
git init
git branch -M main
git add .
git status
git commit -m "Initial clean CircularLoop project"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the URL with your own repository URL. If `origin` already exists, use `git remote -v` and update it with `git remote set-url origin YOUR-REPOSITORY-URL`. Review `git status` before committing and never use `git add -f` for secrets or generated files.
