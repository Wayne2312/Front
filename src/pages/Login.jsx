import { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const Login = () => {
  const { login, error: authError } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(identifier, password, navigate);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="container mx-auto p-4">
      <Helmet>
        <title>Login - Personal Habit Tracker</title>
        <meta name="description" content="Log in to track your habits." />
      </Helmet>
      <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
      {(error || authError) && (
        <p className="text-red-500 mb-4 text-center">{error || authError}</p>
      )}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username or Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="Enter username or email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
