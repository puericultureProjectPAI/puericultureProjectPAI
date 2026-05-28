import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabaseClient";
import LoginForm from "../components/LoginForm";

/**
 * Minimalist Connection Component
 * Focus: Functional testing of the Auth bridge.
 */
export default function Connection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

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
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onLogin={handleLogin}
      status={status}
    />
  );
}
