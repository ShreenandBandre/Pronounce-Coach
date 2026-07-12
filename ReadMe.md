# 🎙 Pronunciation Coach

AI-powered pronunciation feedback app — upload a short speech clip, get a score, and see exactly which words were mispronounced or unclear.

**Live app:** [pronounce-coach.vercel.app](https://pronounce-coach.vercel.app/)

---

## Features

- Upload a 30–45s audio clip and get an instant pronunciation score
- Word-level highlighting: `ok` / `mispronounced` / `unclear`, each with a short tip
- **Multi-lingual support** — English, Hindi, and Marathi speech recognition and scoring (powered by Whisper large-v3's multilingual transcription)
- Optional attempt history, fully opt-in and deletable
- DPDP Act 2023–aligned: no raw audio storage, explicit consent, data minimization
- Fully containerized — one command brings up the database, backend, and frontend together

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React + Vite (JavaScript) · Tailwind CSS 3.4.17 · Zustand |
| Backend | Node.js + Express (JavaScript) |
| AI | Groq API — Whisper large-v3 (transcription) + Llama-3.3-70B (pronunciation judgment) |
| Database | PostgreSQL + Prisma 5.18.0 |
| Infra | Docker + Docker Compose · deployed via Render (backend + DB) and Vercel (frontend) |

---

## Project Structure

```
pronunciation-coach/
├─ docker-compose.yml
├─ backend/
│  ├─ prisma/schema.prisma
│  ├─ src/{config,middleware,services,controllers,routes}/...
│  ├─ Dockerfile · .dockerignore · .env.example
└─ frontend/
   ├─ src/{components,store,lib}/...
   ├─ Dockerfile · nginx.conf · .dockerignore · .env.example
```

---

## Environment Variables

### `backend/.env`
```
PORT=4000
DATABASE_URL=postgresql://app:app@db:5432/pronunciation
GROQ_API_KEY=your_groq_api_key
CORS_ORIGIN=http://localhost:5173
MAX_AUDIO_SECONDS_MIN=30
MAX_AUDIO_SECONDS_MAX=45
```

### `frontend/.env`
```
VITE_API_URL=http://localhost:4000
```

> Copy each `.env.example` to `.env` and fill in your own `GROQ_API_KEY` (get one at [console.groq.com](https://console.groq.com)) before running anything — this is the only required manual step.

---

## 🚀 Run It — Docker (recommended)

Prerequisites: **Docker** and **Docker Compose** installed, and both `.env` files created as above.

```bash
git clone https://github.com/hreenandBandre/Pronounce-Coach.git
cd pronunciation-coach

cp backend/.env.example backend/.env      # then add your GROQ_API_KEY
cp frontend/.env.example frontend/.env

docker compose up --build
```

That single command brings up **all three services** — Postgres, the Express backend, and the React frontend (served via Nginx) — wired together, migrations applied automatically, and the Groq API key picked up from `backend/.env`.

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend health check: [http://localhost:4000/health](http://localhost:4000/health)

To stop: `docker compose down` (add `-v` to also wipe the Postgres volume).

---

## 🖥 Run It — Native Setup (no Docker)

Requires Node.js 20+ and a local/remote PostgreSQL instance.

```bash
# Backend
cd backend
cp .env.example .env        # point DATABASE_URL at your own Postgres, add GROQ_API_KEY
npm install
npx prisma migrate dev --name init
npm run dev                 # http://localhost:4000

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/v1/audio/score` | Upload audio (+ optional reference text) → returns transcript, score, flagged words |
| GET | `/v1/attempts/:sessionId` | Fetch saved attempt history for a session |
| DELETE | `/v1/attempts/:sessionId` | Delete all saved history for a session |
| DELETE | `/v1/attempts/item/:id` | Delete a single attempt |
| GET | `/health` | Service health check |

---

## 🔐 DPDP Act 2023 Compliance

- Raw audio is processed in-memory only and never written to disk or persisted — it's discarded immediately after scoring.
- Explicit consent is required in the UI before any upload is accepted.
- Only derived data (transcript + score) is ever stored, and only if the user opts in to save history.
- Users can delete their history at any time via the delete endpoints above.
- Groq (the AI processor) is disclosed to the user as the only cross-border data processor in the pipeline.

---

## ☁️ Deployment

- **Frontend:** Vercel — live at [pronounce-coach.vercel.app](https://pronounce-coach.vercel.app/)
- **Backend + DB:** Render (Docker web service + managed Postgres)

Full step-by-step deployment instructions (Git branching, Render setup, Vercel setup, env wiring) are in `Pronunciation_Coach_Deployment_Guide.docx`.

---

## 🗺 Roadmap

- Replace confidence-heuristic scoring with a true phoneme-level acoustic aligner
- Expand multilingual support beyond English, Hindi, and Marathi
- User accounts for persistent, cross-device history