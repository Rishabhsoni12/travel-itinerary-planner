import React, { useState } from 'react';
import axios from 'axios';
import Itinerary from './Itinerary';

function Home() {
  const [form, setForm] = useState({
    destination: '',
    days: 1,
    budget: 0,
    travel_type: 'Solo',
    interests: []
  });
  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState('');

  const interestsOptions = ['Food', 'Adventure', 'Sightseeing'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'interests') {
      const newInterests = checked
        ? [...form.interests, value]
        : form.interests.filter((i) => i !== value);
      setForm({ ...form, interests: newInterests });
    } else {
      setForm({ ...form, [name]: type === 'number' ? Number(value) : value });
    }
  };

  const generate = async () => {
    setError('');
    try {
      const response = await axios.post('/generate', form);
      setItinerary(response.data.itinerary);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate itinerary');
    }
  };

  return (
    <div className="home">
      <h2>Plan Your Trip</h2>
      <div className="form">
        <label>
          Destination:
          <input type="text" name="destination" value={form.destination} onChange={handleChange} />
        </label>
        <label>
          Number of days:
          <input type="number" name="days" min="1" value={form.days} onChange={handleChange} />
        </label>
        <label>
          Budget ($):
          <input type="number" name="budget" min="0" value={form.budget} onChange={handleChange} />
        </label>
        <label>
          Travel type:
          <select name="travel_type" value={form.travel_type} onChange={handleChange}>
            <option>Solo</option>
            <option>Couple</option>
            <option>Group</option>
          </select>
        </label>
        <fieldset>
          <legend>Interests:</legend>
          {interestsOptions.map((it) => (
            <label key={it}>
              <input
                type="checkbox"
                name="interests"
                value={it}
                checked={form.interests.includes(it)}
                onChange={handleChange}
              />
              {it}
            </label>
          ))}
        </fieldset>
        <button onClick={generate}>Generate Itinerary</button>
        {error && <p className="error">{error}</p>}
      </div>
      {itinerary.length > 0 && <Itinerary days={itinerary} />}
    </div>
  );
}

export default Home;
