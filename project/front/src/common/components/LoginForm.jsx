import { useState } from "react";
import kiabiLogo from "../../assets/Logo_Kiabi.svg";
import eyeIcon from "../../../src/assets/eye.svg";
import eyeOffIcon from "../../../src/assets/eye-off.svg";
import { NavLink } from "react-router";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  onLogin,
  status,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = !!error;

  const inputClass = (extra = "") =>
    `w-full px-4 py-2.5 ${extra} border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-all shadow-sm ${
      hasError
        ? "border-feedback-background-alert-bold focus:border-feedback-background-alert-bold"
        : "border-gray-300 focus:border-[#000040]"
    }`;

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 flex flex-col items-center">
        <div className="mb-10 mt-2 flex justify-center w-full">
          <img
            src={kiabiLogo}
            alt="Kiabi Logo"
            className="w-56 h-auto object-contain"
          />
        </div>

        <h2 className="text-base font-bold text-[#000040] text-center w-full mb-8 tracking-wide">
          Connectez vous à votre compte Kiabi
        </h2>

        <form onSubmit={onLogin} className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-gray-700 ml-0.5">
              E-mail
            </label>
            <input
              type="email"
              placeholder="example@kiabi.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={hasError}
              className={inputClass()}
              required
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-gray-700 ml-0.5">
              Mot de passe
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={hasError}
                className={inputClass("pr-11")}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors flex items-center justify-center"
              >
                <img
                  src={showPassword ? eyeOffIcon : eyeIcon}
                  alt={showPassword ? "Hide password" : "Show password"}
                  className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
                />
              </button>
            </div>
          </div>

          {hasError && (
            <div
              role="alert"
              className="bg-feedback-background-alert border border-feedback-background-alert-bold text-feedback-background-alert-bold rounded-xl px-4 py-3 text-sm text-center"
            >
              {error}
            </div>
          )}

          <div className="text-center my-1">
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="text-xs text-gray-500 font-medium cursor-pointer hover:underline transition-colors focus:outline-none"
            >
              J'ai oublié mon mot de passe
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#000028] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#000040] active:scale-[0.99] transition-all text-sm tracking-wide mt-2 shadow-md shadow-blue-900/10"
          >
            {status === "Logging in..." ? "Connexion..." : "Me connecter"}
          </button>

          <NavLink className="text-center mt-3" to="../register">
            <button
              type="button"
              className="text-xs text-gray-400 font-medium cursor-pointer hover:underline focus:outline-none"
            >
              Créer mon compte
            </button>
          </NavLink>
        </form>
      </div>
    </div>
  );
}
