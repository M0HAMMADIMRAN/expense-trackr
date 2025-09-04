import { useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      setErr(e.message);
    }
  };

  const onGoogle = async () => {
    setErr("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form
        onSubmit={onSubmit}
        className="bg-white p-4 rounded shadow w-100"
        style={{ maxWidth: "400px" }}
        autoComplete="on" // ✅ allow autofill
      >
        <h3 className="text-center text-primary mb-4">Sign In</h3>

        {/* Email Field */}
        <input
          type="email"
          name="username" // ✅ important for autofill
          placeholder="Email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username" // ✅ autofill email
          required
        />

        {/* Password Field with Toggle */}
        <div className="input-group mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="current-password" // ✅ important for password managers
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" // ✅ autofill password
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

        {/* Error Message */}
        {err && <div className="text-danger mb-2">{err}</div>}

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
