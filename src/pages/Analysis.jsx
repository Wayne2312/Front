import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Analysis = () => {
  const { user, token, error: authError, logout } = useContext(AuthContext);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState("");
  const colors = [
    "rgba(255, 99, 132, 1)", // Red
    "rgba(54, 162, 235, 1)", // Blue
    "rgba(255, 206, 86, 1)", // Yellow
    "rgba(75, 192, 192, 1)", // Teal
    "rgba(153, 102, 255, 1)", // Purple
    "rgba(255, 159, 64, 1)", // Orange
  ];

  useEffect(() => {
    if (user && token) {
      fetchAnalysisData();
    } else {
      setError("Please log in to view analysis");
    }
  }, [user, token]);

  const fetchAnalysisData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/habits/analysis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const validatedData = {
        ...response.data,
        trends: {
          ...response.data.trends,
          data: response.data.habits.reduce((acc, habit) => {
            acc[habit.id] = response.data.trends.data[habit.id] || new Array(response.data.trends.labels.length).fill(0);
            return acc;
          }, {}),
        },
      };
      setAnalysisData(validatedData);
      setError("");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch analysis data";
      setError(message);
      console.error("Fetch analysis error:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        setError("Session expired, please log in again");
      }
    }
  };

  if (!analysisData) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4"
      >
        <Helmet>
          <title>Analysis - Personal Habit Tracker</title>
          <meta name="description" content="Analyze your habit trends and completion rates." />
        </Helmet>
        <p className="text-center text-warm-gray">Loading...</p>
      </motion.section>
    );
  }

  const barChartData = {
    labels: analysisData.habits.map((habit) => habit.name),
    datasets: [
      {
        label: "Total Activities",
        data: analysisData.habits.map((habit) => habit.total_activities),
        backgroundColor: "rgba(255, 107, 107, 0.6)",
        borderColor: "rgba(255, 107, 107, 1)",
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: analysisData.trends.labels,
    datasets: analysisData.habits.map((habit, index) => ({
      label: habit.name,
      data: analysisData.trends.data[habit.id] || [],
      fill: false,
      borderColor: colors[index % colors.length],
      tension: 0.4,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "" },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Activity Count" },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <Helmet>
        <title>Analysis - Personal Habit Tracker</title>
        <meta name="description" content="Analyze your habit trends and completion rates." />
      </Helmet>
      <div className="flex justify-start mb-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/dashboard"
            className="btn-primary px-4 py-2 rounded-lg"
            aria-label="Return to Dashboard"
          >
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
      <h2 className="text-3xl font-bold mb-6 text-center">
        Habit Analysis, {user?.username || "User"}!
      </h2>
      {(error || authError) && (
        <p className="text-red-500 mb-4 text-center">{error || authError}</p>
      )}
      {analysisData.habits.length === 0 ? (
        <p className="text-center text-warm-gray">
          No habits found. Create some habits on the{' '}
          <Link to="/dashboard" className="text-soft-orange hover:underline">
            Dashboard
          </Link>{' '}
          to view analysis.
        </p>
      ) : (
        <>
          <div className="card mb-8">
            <h3 className="text-xl mb-4">Total Activities per Habit</h3>
            <Bar
              data={barChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: true, text: "Activities by Habit" },
                },
              }}
            />
          </div>
          <div className="card mb-8">
            <h3 className="text-xl mb-4">Activity Trends Over Time</h3>
            <Line
              data={lineChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: true, text: "Activity Trends (Last 30 Days)" },
                },
              }}
            />
          </div>
          <div className="card">
            <h3 className="text-xl mb-4">Completion Rates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysisData.habits.map((habit) => (
                <div key={habit.id} className="p-4 bg-warm-beige rounded-lg shadow">
                  <h4 className="text-lg font-semibold">{habit.name}</h4>
                  <p className="text-warm-gray">Frequency: {habit.frequency}</p>
                  <p className="text-soft-orange font-bold">
                    Completion Rate: {(habit.completion_rate * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.section>
  );
};

export default Analysis;
