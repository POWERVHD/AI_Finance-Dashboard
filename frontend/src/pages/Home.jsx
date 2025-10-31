/**
 * Home Page Component
 * Main dashboard view showing financial summary
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { dashboardAPI } from '../services/api';

function Home() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await dashboardAPI.getSummary();
      setSummary(response.data);
    } catch (err) {
      console.error('Failed to fetch dashboard summary:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="alert alert-error">
            {error}
          </div>
          <button onClick={fetchDashboardSummary} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/transactions" className="btn btn-primary">
          Add Transaction
        </Link>
      </div>

      <Dashboard summary={summary} />
    </div>
  );
}

export default Home;
