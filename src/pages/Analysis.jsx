import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analysis = () => {
  const { user, token, error: authError, logout } = useContext(AuthContext);
  const [analysis, setAnalysis] = useState({ habits: [], trends: { labels: [], data: {} } });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Analysis: User:", user, "Token:", token);
    if (!user || !token) {
      console.log("Analysis: No user or token, redirecting to login");
      setError("Please log in to view analysis");
      navigate("/login");
      return;
    }
    console.log("Analysis: Fetching analysis");
    fetchAnalysis();
  }, [user, token, navigate]);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      console.log("Analysis: Sending GET /api/habits/analysis with token:", token);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/habits/analysis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Analysis: Analysis fetched:", response.data);
      setAnalysis(response.data);
      setError("");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch analysis";
      console.error("Analysis: Fetch analysis error:", err.response?.data || err.message);
      setError(message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log("Analysis: Unauthorized, logging out");
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: analysis.trends.labels,
    datasets: analysis.habits.map((habit) => ({
      label: habit.name,
      data: analysis.trends.data[habit.id] || [],
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Habit Activity Over Last 30 Days" },
    },
  };

  return (
    <section className="container mx-auto p-4">
      <Helmet>
        <title>Analysis - Personal Habit Tracker</title>
        <meta name="description" content="View your habit trends and statistics." />
      </Helmet>
      <h2 className="text-3xl font-bold mb-6 text-center">Habit Analysis</h2>
      {(error || authError) && (
        <p className="text-red-500 mb-4 text-center">{error || authError}</p>
      )}
      {loading && <p className="text-center text-warm-gray">Loading...</p>}
      <div className="flex justify-end mb-4 gap-4">
        <Link to="/dashboard" className="btn-primary px-4 py-2 rounded-lg">
          Back to Dashboard
        </Link>
        <button onClick={logout} className="btn-primary px-4 py-2 rounded-lg">
          Logout
        </button>
      </div>
      {analysis.habits.length === 0 && !error && !loading && (
        <p className="text-warm-gray text-center">No habits to analyze. Create some habits first!</p>
      )}
      {analysis.habits.length > 0 && (
        <>
          <div className="card mb-8">
            <h3 className="text-xl mb-4">Habit Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.habits.map((habit) => (
                <div key={habit.id} className="card">
                  <h4 className="text-lg mb-2">{habit.name}</h4>
                  <p className="text-warm-gray">Frequency: {habit.frequency}</p>
                  <p className="text-warm-gray">Total Activities: {habit.total_activities}</p>
                  <p className="text-warm-gray">
                    Completion Rate: {(habit.completion_rate * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="text-xl mb-4">Activity Trends</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </section>
  );
};

export default Analysis;
