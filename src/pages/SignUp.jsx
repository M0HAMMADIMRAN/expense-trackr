import { useState } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow w-100" style={{maxWidth: "400px"}}>
        <h3 className="text-center text-primary mb-4">Sign Up</h3>
        <input type="email" placeholder="Email" className="form-control mb-3"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="form-control mb-3"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <div className="text-danger mb-2">{err}</div>}
        <button type="submit" className="btn btn-primary w-100 mb-2">Sign Up</button>
        <p className="text-center mt-3">Already have an account? <Link to="/signin">Sign In</Link></p>
      </form>
    </div>
  );
}
