from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import os
from supabase import create_client, Client
from fastapi.middleware.cors import CORSMiddleware

# Load env variables (requires python-dotenv)
from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase credentials not set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

# Allow React dev server to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TripRequest(BaseModel):
    destination: str = Field(..., example="Paris")
    days: int = Field(..., gt=0, example=3)
    budget: int = Field(..., gt=0, example=1000)
    travel_type: str = Field(..., example="Solo")
    interests: List[str] = Field(..., example=["Food", "Sightseeing"])

class ItineraryDay(BaseModel):
    day: int
    description: str

class TripResponse(BaseModel):
    id: int | None = None  # Supabase row id after saving
    destination: str
    days: int
    budget: int
    travel_type: str
    interests: List[str]
    itinerary: List[ItineraryDay]

def generate_itinerary(req: TripRequest) -> List[ItineraryDay]:
    # Very simple template logic – each day gets a sentence based on interests.
    activities = []
    interest_map = {
        "Food": "try local cuisine and visit a popular market",
        "Adventure": "go on a hike or try an adventure sport",
        "Sightseeing": "visit iconic sights and take photos",
    }
    # Build a list of activity strings matching selected interests.
    selected_activities = [interest_map[i] for i in req.interests if i in interest_map]
    if not selected_activities:
        selected_activities = ["explore the city at your own pace"]
    for day in range(1, req.days + 1):
        # Rotate through activities for variety
        activity = selected_activities[(day - 1) % len(selected_activities)]
        description = f"Day {day}: {activity}."
        activities.append(ItineraryDay(day=day, description=description))
    return activities

@app.post("/generate", response_model=TripResponse)
async def generate(req: TripRequest):
    itinerary = generate_itinerary(req)
    # Save to Supabase
    payload = {
        "destination": req.destination,
        "days": req.days,
        "budget": req.budget,
        "travel_type": req.travel_type,
        "interests": req.interests,
        "itinerary": [d.dict() for d in itinerary],
    }
    try:
        result = supabase.table("itineraries").insert(payload).execute()
        row_id = result.data[0]["id"] if result.data else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase error: {e}")
    return TripResponse(
        id=row_id,
        destination=req.destination,
        days=req.days,
        budget=req.budget,
        travel_type=req.travel_type,
        interests=req.interests,
        itinerary=itinerary,
    )

@app.get("/trips", response_model=List[TripResponse])
async def get_trips():
    try:
        result = supabase.table("itineraries").select("*").order("created_at", desc=True).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase fetch error: {e}")
    trips = []
    for row in result.data:
        trips.append(
            TripResponse(
                id=row.get("id"),
                destination=row.get("destination"),
                days=row.get("days"),
                budget=row.get("budget"),
                travel_type=row.get("travel_type"),
                interests=row.get("interests"),
                itinerary=[ItineraryDay(**d) for d in row.get("itinerary", [])],
            )
        )
    return trips
