import { useState } from "react";
import kiabiLogo from "../../../src/assets/Logo_Kiabi_(2025).svg.png";
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
    `w-full px-4 py-2.5 ${extra} border rounded-lg text-sm bg-bg-base text-text-brand placeholder-feedback-text-subtle focus:outline-none transition-colors ${
      hasError
        ? "border-feedback-background-alert-bold focus:border-feedback-background-alert-bold"
        : "border-feedback-border-neutral focus:border-feedback-border-brand"
    }`;

  return (
    <div className="w-full min-h-screen bg-bg-base flex flex-col items-center justify-center p-4 font-figtree">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="mb-10 mt-2 flex justify-center w-full">
          <img
            src={kiabiLogo}
            alt="Kiabi Logo"
            className="w-56 h-auto object-contain"
          />
        </div>

        <h2 className="text-xl font-bold text-text-brand text-center w-full mb-8">
          Connectez vous à votre compte Kiabi
        </h2>

        <form onSubmit={onLogin} className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-normal text-text-brand ml-0.5">
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
            <label className="text-sm font-normal text-text-brand ml-0.5">
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-icon-subtle hover:opacity-100 focus:outline-none transition-opacity flex items-center justify-center"
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
            <p
              role="alert"
              className="text-feedback-background-alert-bold text-sm font-medium text-center"
            >
              {error}
            </p>
          )}

          <div className="text-center my-1">
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="text-xs text-feedback-text-subtle font-normal cursor-pointer hover:underline transition-colors focus:outline-none"
            >
              J'ai oublié mon mot de passe
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-bg-brand text-white font-semibold py-3 px-6 rounded-lg hover:bg-text-brand active:scale-[0.99] transition-all text-sm"
          >
            {status === "Logging in..." ? "Connexion..." : "Me connecter"}
          </button>

          <NavLink
            to="../register"
            className="w-full text-center bg-bg-base border border-feedback-border-brand text-feedback-text-brand font-semibold py-3 px-6 rounded-lg hover:bg-text-brand hover:text-white active:scale-[0.99] transition-all text-sm"
          >
            Créer mon compte
          </NavLink>
        </form>
      </div>
    </div>
  );
}
