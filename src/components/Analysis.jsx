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
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/habits/analysis`, 
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Validate response structure
        if (!response.data || !response.data.habits || !response.data.trends) {
          throw new Error('Invalid data format from server');
        }

        setAnalysisData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch analysis data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) return <div className="text-center mt-8 text-gray-600">Loading analysis data...</div>;
  
  if (error) return (
    <div className="text-center mt-8">
      <div className="text-red-500 bg-red-100 border border-red-400 p-3 rounded-lg max-w-md mx-auto">
        {error}
      </div>
    </div>
  );

  if (!analysisData) return (
    <div className="text-center mt-8">
      <div className="text-yellow-600 bg-yellow-100 border border-yellow-400 p-3 rounded-lg max-w-md mx-auto">
        No analysis data available
      </div>
    </div>
  );

  // Prepare chart data with null checks
  const chartData = {
    labels: analysisData.trends?.labels || [],
    datasets: analysisData.habits.map(habit => ({
      label: habit.name,
      data: analysisData.trends?.data?.[habit.id] || Array(30).fill(0),
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      fill: false
    }))
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      },
      title: { 
        display: true, 
        text: 'Habit Completion Trends (Last 30 Days)',
        font: { 
          size: 18, 
          weight: 'bold',
          family: "'Inter', sans-serif" 
        },
        padding: { top: 10, bottom: 30 }
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        title: { 
          display: true, 
          text: 'Completions',
          font: {
            weight: 'bold'
          }
        },
        ticks: { 
          stepSize: 1,
          precision: 0
        }
      },
      x: {
        title: { 
          display: true, 
          text: 'Date',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: false
        },
        ticks: { 
          maxRotation: 45, 
          minRotation: 45 
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Habit Analysis</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {analysisData.habits.map(habit => (
          <div key={habit.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{habit.name}</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Frequency:</span> {habit.frequency}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Total Completions:</span> {habit.total_activities}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Completion Rate:</span> {(habit.completion_rate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <Line 
          data={chartData} 
          options={chartOptions}
          height={100}
        />
      </div>
    </div>
  );
}

export default Analysis;
