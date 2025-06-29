import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Analysis() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/habits/analysis`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAnalysisData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch analysis data');
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  const chartData = {
    labels: analysisData.trends.labels,
    datasets: analysisData.habits.map(habit => ({
      label: habit.name,
      data: analysisData.trends.data[habit.id],
      borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      fill: false
    }))
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Habit Completion Trends (Last 30 Days)' }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Completions' } },
      x: { title: { display: true, text: 'Date' } }
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Habit Analysis</h2>
      <div className="grid gap-4">
        {analysisData.habits.map(habit => (
          <div key={habit.id} className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold">{habit.name}</h3>
            <p>Frequency: {habit.frequency}</p>
            <p>Total Completions: {habit.total_activities}</p>
            <p>Completion Rate: {(habit.completion_rate * 100).toFixed(2)}%</p>
          </div>
        ))}
        <div className="p-4 bg-white rounded shadow">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Analysis;