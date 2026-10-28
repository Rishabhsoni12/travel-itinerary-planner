import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('/trips');
        setTrips(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load trips');
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="my-trips">
      <h2>Saved Trips</h2>
      {error && <p className="error">{error}</p>}
      {trips.length === 0 && !error && <p>No trips saved yet.</p>}
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            <strong>{trip.destination}</strong> – {trip.days} days, {trip.travel_type}
            <ul>
              {trip.itinerary.map((day) => (
                <li key={day.day}>{day.description}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyTrips;
