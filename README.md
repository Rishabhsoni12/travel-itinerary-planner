# travel-itinerary-planner
# Personalized Travel Itinerary Planner

A small, beginner‑friendly web application that lets a user input travel preferences, generates a simple day‑by‑day itinerary, and stores the result in Supabase.

## Project Structure
```
Travel Guide/
├─ backend/                # FastAPI server
│   ├─ main.py             # API implementation
│   └─ requirements.txt    # Python dependencies
├─ frontend/               # React app
│   ├─ public/
│   │   └─ index.html
│   └─ src/
│       ├─ App.js          # Main UI
│       ├─ index.js        # React entry point
│       └─ components/
│           └─ Itinerary.js # Component that shows generated itinerary
│   └─ package.json        # npm dependencies & scripts
├─ supabase/               # Simple DB schema
│   └─ schema.sql          # Table definition
├─ .env.example            # Example environment variables
└─ README.md               # This file
```

## Prerequisites
- **Node.js** (v18+) and **npm** (or **pnpm**) – for the React frontend.
- **Python 3.11+** – for the FastAPI backend.
- A **Supabase** project (free tier is enough). Grab the URL and anon‑key from the Supabase dashboard.

## Setup
### 1. Clone the repo (if you haven't already)
```bash
# Already in the workspace – nothing to do
```

### 2. Backend (FastAPI)
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # on Windows
pip install -r requirements.txt
```
Create a ```.env``` file based on ```.env.example``` and fill in your Supabase credentials:
```text
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-anon-key
```
Run the server:
```bash
uvicorn main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

### 3. Frontend (React)
```bash
cd ../frontend
npm install   # or "pnpm install"
npm start
```
The React app will open at `http://localhost:3000` and proxy API calls to the FastAPI server.

### 4. Supabase schema
Open the Supabase SQL editor and run the contents of `supabase/schema.sql` (or use the CLI). It creates a single table `itineraries`.

## How it works
1. The user fills the form on the Home page.
2. When **Generate Itinerary** is clicked, the React app POSTs the data to `/generate` on the FastAPI server.
3. The backend builds a tiny itinerary using hard‑coded templates based on the selected interests.
4. The generated itinerary is returned to the frontend **and** inserted into Supabase.
5. The **My Trips** page fetches saved itineraries from Supabase and displays them.

## Environment variables (`.env.example`)
```
# FastAPI
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_KEY=YOUR-ANON-KEY
```
Create a real ```.env``` file in `backend/` before running the server.

## Running the whole app
1. Start the FastAPI backend (`uvicorn` command above).
2. In another terminal, start the React frontend (`npm start`).
3. Open the browser at `http://localhost:3000`.

Enjoy building your travel plans!
