import { useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(""); // ✅ success state
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("✅ Logged in successfully!");
      setTimeout(() => navigate("/"), 1500); // delay to show message
    } catch (e) {
      let msg = "Something went wrong. Please try again.";
      switch (e.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
          msg = "Account does not exist. Please sign up first.";
          break;
        case "auth/wrong-password":
          msg = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          msg = "Invalid email address format.";
          break;
        case "auth/user-disabled":
          msg = "This account has been disabled. Contact support.";
          break;
        default:
          msg = e.message;
      }
      setErr(msg);
    }
  };

  const onGoogle = async () => {
    setErr("");
    setSuccess("");
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccess("✅ Logged in successfully with Google!");
      setTimeout(() => navigate("/"), 1500);
    } catch (e) {
      setErr("Google login failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form
        onSubmit={onSubmit}
        className="bg-white p-4 rounded shadow w-100"
        style={{ maxWidth: "400px" }}
        autoComplete="on"
      >
        <h3 className="text-center text-primary mb-4">Sign In</h3>

        {/* Alerts */}
        {err && <div className="alert alert-danger">{err}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Email */}
        <input
          type="email"
          name="username"
          placeholder="Email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />

        {/* Password + Toggle */}
        <div className="input-group mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="current-password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈 Hide" : "👁️ Show"}
          </button>
        </div>

        {/* Actions */}
        <button type="submit" className="btn btn-primary w-100 mb-2">
          Sign In
        </button>
        <button
          type="button"
          onClick={onGoogle}
          className="btn btn-outline-dark w-100"
        >
          Sign in with Google
        </button>

        <p className="text-center mt-3">
          New here? <Link to="/signup">Create account</Link>
        </p>
      </form>
    </div>
  );
}
