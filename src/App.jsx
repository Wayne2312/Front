import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Login from './pages/Login';
import Register from './pages/Register';
import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    console.error('ErrorBoundary: Caught error:', error);
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="container mx-auto p-4 text-red-500 text-center">
          <h1>Error: {this.state.error.message}</h1>
          <p>Please refresh or contact support.</p>
        </div>
      );
    }
    console.log('ErrorBoundary: Rendering children');
    return this.props.children;
  }
}

function App() {
  console.log('App: Rendering');
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
