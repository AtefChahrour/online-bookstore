import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // reset password UI
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");
  const [resetErr, setResetErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Email is required.");
    if (!password) return setError("Password is required.");

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin?.(data.user);
      navigate("/");
    } catch (e2) {
      setError(e2.message || "Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function requestReset() {
    setResetErr("");
    setResetMsg("");

    if (!resetEmail.trim()) {
      setResetErr("Email is required.");
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Reset request failed.");

      // In dev we return resetUrl, show it to the user
      if (data.resetUrl) {
        setResetMsg(`Reset link: ${data.resetUrl}`);
      } else {
        setResetMsg(data.message || "If that email exists, a reset link was generated.");
      }
    } catch (e2) {
      setResetErr(e2.message || "Network error.");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 className="h1">Log in</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>

          {error && <div className="msg-err">{error}</div>}

          <button className="btn btn-primary" disabled={loading} type="submit">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div style={{ marginTop: 14 }}>
          <button className="btn" onClick={() => setShowReset((v) => !v)} type="button">
            Reset password
          </button>
        </div>

        {showReset && (
          <div className="card" style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Reset password</div>

            <label className="label">Email</label>
            <input
              className="input"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
            />

            <div style={{ marginTop: 12 }} className="row">
              <button
                className="btn btn-primary"
                onClick={requestReset}
                disabled={resetLoading}
                type="button"
              >
                {resetLoading ? "Sending..." : "Send reset link"}
              </button>
            </div>

            {resetErr && <div className="msg-err" style={{ marginTop: 10 }}>{resetErr}</div>}
            {resetMsg && <div className="msg-ok" style={{ marginTop: 10, wordBreak: "break-word" }}>{resetMsg}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
