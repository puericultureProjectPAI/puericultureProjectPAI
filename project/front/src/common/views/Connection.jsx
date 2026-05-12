import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabaseClient";

/**
 * Minimalist Connection Component
 * Focus: Functional testing of the Auth bridge.
 */
export default function Connection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setStatus("Signing up...");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Metadata required for the PostgreSQL Trigger
        data: { name: "Test User" },
      },
    });

    if (error) {
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus("Account created. Redirecting...");
      setTimeout(() => navigate("/home"), 1000);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("Logging in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus("Login successful.");
      navigate("/home");
    }
  };

  return (
    <div>
      <h2>Auth Test Page</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignUp}>Register</button>
      </form>

      {status && (
        <p>
          <strong>Status:</strong> {status}
        </p>
      )}
    </div>
  );
}
