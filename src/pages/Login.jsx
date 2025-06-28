import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuthContext from "../contexts/AuthContext";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(identifier, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="container mx-auto p-4 max-w-md">
      <Helmet>
        <title>Login - Personal Habit Tracker</title>
        <meta name="description" content="Log in to your Personal Habit Tracker account to start tracking your habits and achieving your goals." />
      </Helmet>
      <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="card">
        <div className="mb-4">
          <label htmlFor="identifier" className="block mb-2 font-medium">Username or Email</label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-3 border rounded-lg bg-warm-beige"
            required
            aria-describedby="identifier-error"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 font-medium">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg bg-warm-beige"
            required
            aria-describedby="password-error"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="btn-primary w-full"
          aria-label="Log in to your account"
        >
          Login
        </button>
        <p className="mt-4 text-center text-warm-gray">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-soft-orange hover:underline"
            aria-label="Navigate to registration page"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;