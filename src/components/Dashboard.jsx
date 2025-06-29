import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ user }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newHabit, setNewHabit] = useState({ name: '', description: '', frequency: 'daily' });
  const [editingHabit, setEditingHabit] = useState(null);

  const fetchHabits = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/habits`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setHabits(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch habits');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.name.trim()) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/habits`, newHabit, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setHabits([...habits, { ...newHabit, id: response.data.id, streak: 0 }]);
      setNewHabit({ name: '', description: '', frequency: 'daily' });
    } catch (err) {
      setError('Failed to add habit');
    }
  };

  const updateHabit = async (id, updatedHabit) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/habits/${id}`, updatedHabit, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setHabits(habits.map(habit => habit.id === id ? { ...habit, ...updatedHabit } : habit));
      setEditingHabit(null);
    } catch (err) {
      setError('Failed to update habit');
    }
  };

  const deleteHabit = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/habits/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setHabits(habits.filter(habit => habit.id !== id));
    } catch (err) {
      setError('Failed to delete habit');
    }
  };

  const logActivity = async (id) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/habits/${id}/log`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setHabits(habits.map(habit => 
        habit.id === id ? { ...habit, streak: response.data.streak } : habit
      ));
    } catch (err) {
      setError('Failed to log activity');
    }
  };

  const startEditing = (habit) => {
    setEditingHabit({ ...habit });
  };

  const cancelEditing = () => {
    setEditingHabit(null);
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.username}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Add Habit Form */}
          <div className="mb-8 p-4 bg-white rounded shadow">
            <h3 className="text-xl font-bold mb-4">Add New Habit</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Habit Name"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <textarea
                placeholder="Description"
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <select
                value={newHabit.frequency}
                onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <button
                onClick={addHabit}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Add Habit
              </button>
            </div>
          </div>

          {/* Habit List */}
          <div className="grid gap-4">
            {habits.length === 0 ? (
              <p className="text-gray-500">No habits yet. Add one above!</p>
            ) : (
              habits.map(habit => (
                <div key={habit.id} className="p-4 bg-white rounded shadow flex flex-col gap-2">
                  {editingHabit?.id === habit.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingHabit.name}
                        onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <textarea
                        value={editingHabit.description}
                        onChange={(e) => setEditingHabit({ ...editingHabit, description: e.target.value })}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <select
                        value={editingHabit.frequency}
                        onChange={(e) => setEditingHabit({ ...editingHabit, frequency: e.target.value })}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateHabit(habit.id, editingHabit)}
                          className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex-1 bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold">{habit.name}</h3>
                      <p className="text-gray-600">{habit.description}</p>
                      <p className="text-sm text-gray-500">Frequency: {habit.frequency}</p>
                      <p className="text-sm text-blue-600">Streak: {habit.streak}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => logActivity(habit.id)}
                          className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                        >
                          Log Activity
                        </button>
                        <button
                          onClick={() => startEditing(habit)}
                          className="flex-1 bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;