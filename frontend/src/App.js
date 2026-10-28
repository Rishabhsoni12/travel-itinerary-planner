import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import MyTrips from './components/MyTrips';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <h1>Travel Itinerary Planner</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/trips">My Trips</Link></li>
        </ul>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<MyTrips />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
