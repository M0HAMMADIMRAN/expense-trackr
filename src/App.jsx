import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link to="/dashboard" className="navbar-brand">
            Expense Tracker
          </Link>
          <div className="d-flex">
            {user ? (
              <button onClick={handleLogout} className="btn btn-light">
                Logout
              </button>
            ) : (
              <>
                <Link to="/signin" className="btn btn-light me-2">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-outline-light">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
