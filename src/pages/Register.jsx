import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuthContext from "../contexts/AuthContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="container mx-auto p-4 max-w-md">
      <Helmet>
        <title>Register - Personal Habit Tracker</title>
        <meta name="description" content="Create an account with Personal Habit Tracker to start building and tracking your habits." />
      </Helmet>
      <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="card">
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 font-medium">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg bg-warm-beige"
            required
            aria-describedby="username-error"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg bg-warm-beige"
            required
            aria-describedby="email-error"
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
          aria-label="Register a new account"
        >
          Register
        </button>
        <p className="mt-4 text-center text-warm-gray">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-soft-orange hover:underline"
            aria-label="Navigate to login page"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;