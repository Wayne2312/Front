import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({ name: "", description: "", frequency: "daily" });
  const [editingHabit, setEditingHabit] = useState(null);
  const [history, setHistory] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && localStorage.getItem("token")) {
      fetchHabits();
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view habits");
        return;
      }
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(response.data || []);
      setError("");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch habits";
      console.error("Fetch habits error:", err.response?.data || err.message);
      setError(message);
      if (message.includes("Token")) {
        localStorage.removeItem("token");
      }
    }
  };

  const handleCreateHabit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to create a habit");
        return;
      }
      const payload = {
        name: newHabit.name,
        description: newHabit.description,
        frequency: newHabit.frequency.toLowerCase(), // Ensure lowercase
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/habits`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewHabit({ name: "", description: "", frequency: "daily" });
      setError("");
      fetchHabits();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create habit";
      console.error("Create habit error:", err.response?.data || err.message);
      setError(message);
      if (message.includes("Token")) {
        localStorage.removeItem("token");
      }
    }
  };

  const handleUpdateHabit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to update a habit");
        return;
      }
      const payload = {
        name: editingHabit.name,
        description: editingHabit.description,
        frequency: editingHabit.frequency.toLowerCase(), // Ensure lowercase
      };
      await axios.put(`${import.meta.env.VITE_API_URL}/habits/${editingHabit.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingHabit(null);
      setError("");
      fetchHabits();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update habit";
      console.error("Update habit error:", err.response?.data || err.message);
      setError(message);
      if (message.includes("Token")) {
        localStorage.removeItem("token");
      }
    }
  };

  const handleDeleteHabit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to delete a habit");
        return;
      }
      await axios.delete(`${import.meta.env.VITE_API_URL}/habits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError("");
      fetchHabits();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete habit";
      console.error("Delete habit error:", err.response?.data || err.message);
      setError(message);
      if (message.includes("Token")) {
        localStorage.removeItem("token");
      }
    }
  };

  const handleLogActivity = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to log an activity");
        return;
      }
      await axios.post(`${import.meta.env.VITE_API_URL}/habits/${id}/log`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError("");
      fetchHabits();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to log activity";
      console.error("Log activity error:", err.response?.data || err.message);
      setError(message);
      if (message.includes("Token")) {
        localStorage.removeItem("token");
      }
    }
  };

  const fetchHistory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view history");
        return;
      }
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/habits/${id}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) => ({ ...prev, [id]: response.data }));
      setError("");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch history";
      console.error("Fetch history error:", err.response?.data || err.message);
      setError(message);
      if (message.includes("Token")) {
        localStorage.removeItem("token");
      }
    }
  };

  return (
    <section className="container mx-auto p-4">
      <Helmet>
        <title>Dashboard - Personal Habit Tracker</title>
        <meta
          name="description"
          content="View and manage your habits, track streaks, and log activities in your Personal Habit Tracker dashboard."
        />
      </Helmet>
      <h2 className="text-3xl font-bold mb-6 text-center">
        Welcome, {user?.username || "User"}!
      </h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="flex justify-end mb-4">
        <Link
          to="/analysis"
          className="btn-primary px-4 py-2 rounded-lg"
          aria-label="View habit analysis"
        >
          View Analysis
        </Link>
      </div>
      <div className="card mb-8">
        <h3 className="text-xl mb-4">{editingHabit ? "Edit Habit" : "Create New Habit"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Habit Name"
            value={editingHabit ? editingHabit.name : newHabit.name}
            onChange={(e) =>
              editingHabit
                ? setEditingHabit({ ...editingHabit, name: e.target.value })
                : setNewHabit({ ...newHabit, name: e.target.value })
            }
            className="p-3 border rounded-lg bg-warm-beige"
            aria-label="Habit name"
          />
          <input
            type="text"
            placeholder="Description"
            value={editingHabit ? editingHabit.description : newHabit.description}
            onChange={(e) =>
              editingHabit
                ? setEditingHabit({ ...editingHabit, description: e.target.value })
                : setNewHabit({ ...newHabit, description: e.target.value })
            }
            className="p-3 border rounded-lg bg-warm-beige"
            aria-label="Habit description"
          />
          <select
            value={editingHabit ? editingHabit.frequency : newHabit.frequency}
            onChange={(e) =>
              editingHabit
                ? setEditingHabit({ ...editingHabit, frequency: e.target.value })
                : setNewHabit({ ...newHabit, frequency: e.target.value })
            }
            className="p-3 border rounded-lg bg-warm-beige"
            aria-label="Habit frequency"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <button
          onClick={editingHabit ? handleUpdateHabit : handleCreateHabit}
          className="btn-primary mt-4 w-full md:w-auto"
          aria-label={editingHabit ? "Update habit" : "Create habit"}
        >
          {editingHabit ? "Update Habit" : "Create Habit"}
        </button>
        {editingHabit && (
          <button
            onClick={() => setEditingHabit(null)}
            className="btn-secondary mt-2 w-full md:w-auto"
            aria-label="Cancel edit"
          >
            Cancel
          </button>
        )}
      </div>
      <h3 className="text-2xl mb-4">Your Habits</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {habits.map((habit) => (
            <motion.article
              key={habit.id}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-lg mb-2">{habit.name}</h4>
              <p className="text-warm-gray mb-2">{habit.description}</p>
              <p className="text-warm-gray mb-2">Frequency: {habit.frequency}</p>
              <p className="text-soft-orange font-bold mb-4">Streak: {habit.streak}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleLogActivity(habit.id)}
                  className="btn-primary"
                  aria-label={`Log activity for ${habit.name}`}
                >
                  Log Activity
                </button>
                <button
                  onClick={() => setEditingHabit(habit)}
                  className="btn-secondary"
                  aria-label={`Edit ${habit.name}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Delete ${habit.name}`}
                >
                  Delete
                </button>
              </div>
              <button
                onClick={() => fetchHistory(habit.id)}
                className="mt-4 text-soft-orange hover:underline font-semibold"
                aria-label={`View history for ${habit.name}`}
              >
                View History
              </button>
              <AnimatePresence>
                {history[habit.id] && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 bg-warm-beige p-4 rounded-lg shadow-md"
                  >
                    <h5 className="text-lg font-semibold text-soft-orange mb-2">Activity History</h5>
                    <ul className="text-sm text-warm-gray list-disc pl-5 space-y-2">
                      {history[habit.id].map((activity) => (
                        <li
                          key={activity.id}
                          className="hover:bg-soft-orange hover:text-white p-2 rounded transition-colors duration-200"
                        >
                          {new Date(activity.completed_at).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Dashboard;
