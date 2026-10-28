import React from 'react';

function Itinerary({ days }) {
  return (
    <div className="itinerary">
      <h3>Your Itinerary</h3>
      <ul>
        {days.map((day) => (
          <li key={day.day}>{day.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default Itinerary;
