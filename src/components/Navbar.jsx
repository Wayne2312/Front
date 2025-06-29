import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Habit Tracker</h1>
        {isLoggedIn && (
          <div className="flex gap-4">
            <Link to="/" className="text-white hover:underline">Dashboard</Link>
            <Link to="/analysis" className="text-white hover:underline">Analysis</Link>
            <button
              onClick={onLogout}
              className="text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;