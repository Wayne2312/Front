import { useContext } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuthContext from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <Helmet>
        <title>Personal Habit Tracker - Build and Track Your Habits</title>
        <meta
          name="description"
          content="Track your habits with ease using our simple, personalized habit tracker. Stay consistent and achieve your goals."
        />
        <meta
          name="keywords"
          content="habit tracker, personal growth, productivity, daily habits, streak tracking, habit analysis"
        />
      </Helmet>
      <header className="bg-muted-brown text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-gray-800 hover:text-soft-orange transition"
          >
            Habit Tracker
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-gray-600 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/analysis"
                  className="text-gray-700 hover:text-gray-600 transition"
                >
                  Analysis
                </Link>
                <span className="text-gray-700">Welcome, {user.username}</span>
                <button
                  onClick={logout}
                  className="btn-secondary text-gray-800 hover:bg-gray-600 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-soft-orange transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-soft-orange transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;