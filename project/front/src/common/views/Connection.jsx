import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabaseClient";

import InstallPWA from "../components/InstallPWA";
import LoginForm from "../components/LoginForm";

/**
 * Minimalist Connection Component
 * Focus: Functional testing of the Auth bridge.
 */
export default function Connection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("Logging in...");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Email ou mot de passe incorrect.");
      setStatus("");
    } else {
      setStatus("Login successful.");
      navigate("/home");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onLogin={handleLogin}
        status={status}
        error={error}
      />

      <div className="fixed bottom-0 left-0 w-full z-50">
        <InstallPWA />
      </div>
    </div>
  );
}
