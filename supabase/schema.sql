-- supabase/schema.sql

-- Table to store generated itineraries
create table if not exists itineraries (
    id bigint generated always as identity primary key,
    destination text not null,
    days integer not null,
    budget integer not null,
    travel_type text not null,
    interests jsonb not null,
    itinerary jsonb not null,
    created_at timestamp with time zone default now()
);
