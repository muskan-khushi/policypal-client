import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // --- THIS IS THE FIX ---
  // We now use the environment variable for the API URL.
  const API_ENDPOINT = `${process.env.API_URL}/api/user/login`;
  // --------------------

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // The fetch call now uses the correct, dynamic URL
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/chat");
        // We'll use a more modern notification system later, but alert is fine for now.
        alert("Login successful");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="form-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2 className="auth-title">Already a member?</h2>

        <div className="input-group">
          <label htmlFor="login-email">Email</label>
          <input
            type="email"
            id="login-email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="login-password">Password</label>
          <input
            type="password"
            id="login-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="options-container">
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="submit-button">
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
