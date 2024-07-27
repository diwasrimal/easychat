import { useRef, useState } from "react";
import { makePayload } from "../utils/utils";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { Navigate } from "react-router-dom";

export default function Login() {
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const [err, setErr] = useState("");

  // Upon successful login, authentication context values will
  // be filled and we redirect to /home
  const { loggedIn, setLoggedIn, setUserId } = useContext(AuthContext);

  function handleLogin(e) {
    e.preventDefault();
    const email = emailInput.current.value.trim();
    const password = passwordInput.current.value;
    if (!email || !password) {
      setErr("Missing login details");
      return;
    }
    fetch("/api/login", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
      .then((res) => makePayload(res))
      .then((payload) => {
        console.log(payload);
        if (payload.ok) {
          setErr("");
          setLoggedIn(true);
          setUserId(payload.userId);
          localStorage.setItem("jwt", payload.jwt);
          localStorage.setItem("loggedInUserId", payload.userId);
        } else {
          setErr(payload.message || "Unkown error occurred");
        }
      });
  }

  if (loggedIn) return <Navigate to="/home" />;

  return (
    <main className="container h-100 d-flex flex-column gap-4 justify-content-center align-items-center">
      <h2>Login to EasyChat</h2>
      <form onSubmit={handleLogin} className="d-flex flex-column">
        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email-input" className="form-label">
            Email
          </label>
          <input
            type="email"
            required
            ref={emailInput}
            className="form-control"
            placeholder="Enter your email"
            id="email-input"
          />
        </div>
        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password-input" className="form-label">
            Password
          </label>
          <input
            type="password"
            required
            ref={passwordInput}
            className="form-control"
            placeholder="Enter your password"
            id="password-input"
          />
        </div>
        {err && <div className="text-danger">{err}</div>}
        <button type="submit" className="btn btn-primary mt-3">
          Login
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register</a> here.
      </p>
    </main>
  );
}
