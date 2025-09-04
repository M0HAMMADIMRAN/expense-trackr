import { useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch {
      setError("Account does not exist or wrong credentials.");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-4">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Sign In</h3>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  autoComplete="username"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Sign In
              </button>
            </form>
            <p className="mt-3 text-center">
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
