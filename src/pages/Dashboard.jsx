import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { user, token, error: authError, logout } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({ name: "", description: "", frequency: "daily" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard: User:", user, "Token:", token);
    if (!user || !token) {
      console.log("Dashboard: No user or token, redirecting to login");
      setError("Please log in to view habits");
      navigate("/login");
      return;
    }
    console.log("Dashboard: Fetching habits");
    fetchHabits();
  }, [user, token, navigate]);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      console.log("Dashboard: Sending GET /api/habits with token:", token);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Dashboard: Habits fetched:", response.data);
      setHabits(response.data || []);
      setError("");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch habits";
      console.error("Dashboard: Fetch habits error:", err.response?.data || err.message);
      setError(message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log("Dashboard: Unauthorized, logging out");
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async () => {
    if (!newHabit.name.trim()) {
      setError("Habit name is required");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: newHabit.name.trim(),
        description: newHabit.description.trim(),
        frequency: newHabit.frequency.toLowerCase(),
      };
      console.log("Dashboard: Sending POST /api/habits with payload:", payload, "token:", token);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/habits`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Dashboard: Habit created:", response.data);
      setNewHabit({ name: "", description: "", frequency: "daily" });
      setError("");
      fetchHabits();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create habit";
      console.error("Dashboard: Create habit error:", err.response?.data || err.message);
      setError(message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log("Dashboard: Unauthorized, logging out");
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto p-4">
      <Helmet>
        <title>Dashboard - Personal Habit Tracker</title>
        <meta name="description" content="Manage your habits and track streaks." />
      </Helmet>
      <h2 className="text-3xl font-bold mb-6 text-center">
        Welcome, {user?.username || "User"}!
      </h2>
      {(error || authError) && (
        <p className="text-red-500 mb-4 text-center">{error || authError}</p>
      )}
      {loading && <p className="text-center text-warm-gray">Loading...</p>}
      <div className="flex justify-end mb-4 gap-4">
        <Link to="/analysis" className="btn-primary px-4 py-2 rounded-lg">
          View Analysis
        </Link>
        <button onClick={logout} className="btn-primary px-4 py-2 rounded-lg">
          Logout
        </button>
      </div>
      <div className="card mb-8">
        <h3 className="text-xl mb-4">Create New Habit</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Habit Name"
            value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            className="p-3 border rounded-lg bg-warm-beige"
          />
          <input
            type="text"
            placeholder="Description"
            value={newHabit.description}
            onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
            className="p-3 border rounded-lg bg-warm-beige"
          />
          <select
            value={newHabit.frequency}
            onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
            className="p-3 border rounded-lg bg-warm-beige"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <button
          onClick={handleCreateHabit}
          className="btn-primary mt-4 w-full md:w-auto"
          disabled={loading}
        >
          Create Habit
        </button>
      </div>
      <h3 className="text-2xl mb-4">Your Habits</h3>
      {habits.length === 0 && !error && !loading && (
        <p className="text-warm-gray text-center">No habits yet. Create one above!</p>
      )}
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
              <p className="text-warm-gray mb-2">{habit.description || "No description"}</p>
              <p className="text-warm-gray mb-2">Frequency: {habit.frequency}</p>
              <p className="text-soft-orange font-bold mb-4">Streak: {habit.streak || 0}</p>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Dashboard;
