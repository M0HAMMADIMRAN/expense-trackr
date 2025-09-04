import { useState } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
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
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("✅ Account created successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (e) {
      let msg = "Something went wrong. Please try again.";
      switch (e.code) {
        case "auth/email-already-in-use":
          msg = "Account already exists with this email.";
          break;
        case "auth/invalid-email":
          msg = "Invalid email address format.";
          break;
        case "auth/weak-password":
          msg = "Password is too weak. Use at least 6 characters.";
          break;
        default:
          msg = e.message;
      }
      setErr(msg);
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
        <h3 className="text-center text-primary mb-4">Sign Up</h3>

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
            name="new-password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
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
          Sign Up
        </button>
        <p className="text-center mt-3">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
