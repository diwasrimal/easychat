import { useRef, useState } from "react";
import { makePayload } from "../utils/utils";
import { Navigate } from "react-router-dom";

export default function Register() {
  const fullnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [registered, setRegistered] = useState(false);
  const [err, setErr] = useState("");

  function handleRegister(e) {
    e.preventDefault();
    const fullname = fullnameRef.current.value.trim();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!fullname || !email || !password || !confirmPassword) {
      setErr("Missing user details");
      return;
    }

    if (password !== confirmPassword) {
      setErr("Passwords don't match");
      return;
    }

    fetch("/api/register", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        fullname,
        email,
        password,
      }),
    })
      .then((res) => makePayload(res))
      .then((payload) => {
        if (!payload.ok) {
          setErr(payload.data.message || "Some error occurred!");
        } else {
          setRegistered(true);
          setErr("");
        }
      });
  }

  if (registered) return <Navigate to="/login" />;

  return (
    <main className="container h-100 d-flex flex-column gap-4 justify-content-center align-items-center">
      <h2>Register to EasyChat</h2>
      <form onSubmit={handleRegister} className="d-flex flex-column gap-2">
        {/* Fullname */}
        <div>
          <label htmlFor="fullname-input" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            required
            ref={fullnameRef}
            className="form-control"
            placeholder="Enter your full name"
            id="fullname-input"
          />
        </div>
        {/* Email */}
        <div>
          <label htmlFor="email-input" className="form-label">
            Email
          </label>
          <input
            type="email"
            required
            ref={emailRef}
            className="form-control"
            placeholder="Enter your email"
            id="email-input"
          />
        </div>
        {/* Password */}
        <div>
          <label htmlFor="password-input" className="form-label">
            Password
          </label>
          <input
            type="password"
            required
            ref={passwordRef}
            className="form-control"
            placeholder="Create a password"
            id="password-input"
          />
        </div>
        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm-password-input" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            required
            ref={confirmPasswordRef}
            className="form-control"
            placeholder="Confirm your password"
            id="confirm-password-input"
          />
        </div>
        {err && <div className="text-danger">{err}</div>}
        <button type="submit" className="btn btn-primary mt-3">
          Register
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a> here.
      </p>
    </main>
  );
}
