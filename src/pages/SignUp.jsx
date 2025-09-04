import { useState } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-4">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Sign Up</h3>
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
                  autoComplete="new-password"
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
              <button type="submit" className="btn btn-success w-100">
                Sign Up
              </button>
            </form>
            <p className="mt-3 text-center">
              Already have an account? <Link to="/signin">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
