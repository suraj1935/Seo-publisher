"use client";

import { useState } from "react";
import { loginAdmin } from "@/lib/auth-actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await loginAdmin(email, password);

    setLoading(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="login-page bg-white text-[#061847]">
      <div className="login-shell grid overflow-hidden bg-[radial-gradient(circle_at_94%_7%,rgba(66,133,244,0.10)_0,transparent_23%),linear-gradient(135deg,#fffaf4_0%,#f8fcff_42%,#edf7ff_100%)] shadow-[0_18px_70px_rgba(15,23,42,0.08)]">
        <section
          className="login-brand-panel relative hidden overflow-hidden lg:block"
          aria-label="Sun Sky brand"
        >
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/sunsky-approved-brand-panel.png')" }}
          />
        </section>

        <main className="login-main relative flex items-center justify-center">
          <div className="login-dots absolute hidden opacity-70 lg:block">
            <DotPattern />
          </div>

          <div className="login-panel-wrap w-full">
            <form
              onSubmit={handleLogin}
              className="login-card border border-white/80 bg-white/92 shadow-[0_30px_80px_rgba(15,23,42,0.16)] backdrop-blur"
            >
              <div className="login-card-heading text-center">
                <h1 className="login-title font-bold leading-tight tracking-normal text-[#061847]">
                  Welcome Back!
                </h1>
                <p className="login-subtitle leading-6 text-[#31466f]">
                  Sign in to continue to Sun Sky
                </p>
                <div className="login-accent mx-auto h-0.5 rounded-full bg-[#ff7a00]" />
              </div>

              <div className="login-fields">
                <div>
                  <label
                    htmlFor="email"
                    className="login-label block font-bold text-[#061847]"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <MailIcon className="login-input-icon pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#7d91b3]" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-input w-full rounded-[8px] border border-[#cbd7e8] bg-white text-[#061847] outline-none transition placeholder:text-[#8fa0bb] focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="login-label block font-bold text-[#061847]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <LockIcon className="login-input-icon pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#7d91b3]" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-input w-full rounded-[8px] border border-[#cbd7e8] bg-white text-[#061847] outline-none transition placeholder:text-[#8fa0bb] focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="login-eye-button absolute top-1/2 -translate-y-1/2 rounded p-1 text-[#7d91b3] transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon className="login-eye-icon" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="login-options flex items-center justify-between gap-4">
                <label className="flex min-w-0 items-center gap-3 text-[#31466f]">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="login-checkbox rounded border-[#cbd7e8] accent-[#ff7a00]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="shrink-0 font-semibold text-[#006dff] hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="login-submit flex w-full items-center justify-center rounded-[8px] bg-[linear-gradient(100deg,#ff7a13_0%,#c25365_45%,#006dff_100%)] font-bold text-white shadow-[0_22px_48px_rgba(21,101,255,0.24)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="login-divider flex items-center gap-5 font-semibold text-[#65789c]">
                <div className="h-px flex-1 bg-[#dfe6f1]" />
                <span>or</span>
                <div className="h-px flex-1 bg-[#dfe6f1]" />
              </div>

              <button
                type="button"
                className="login-google flex w-full items-center justify-center gap-4 rounded-[8px] border border-[#d4deeb] bg-white font-bold text-[#061847] shadow-[0_4px_18px_rgba(15,23,42,0.06)] transition hover:bg-slate-50"
              >
                <GoogleIcon className="h-6 w-6" />
                <span>Sign in with Google</span>
              </button>

              <p className="login-signup text-center text-[#31466f]">
                New to Sun Sky?{" "}
                <button
                  type="button"
                  className="font-semibold text-[#006dff] hover:text-blue-700"
                >
                  Create an account
                </button>
              </p>
            </form>

            <div className="login-security flex items-start justify-center gap-4 text-[#65789c]">
              <ShieldIcon className="login-security-icon shrink-0 text-[#8ea0bc]" />
              <p className="max-w-[310px] leading-5">
                <span className="block font-semibold">Your data is secure with us.</span>
                We use industry-standard encryption to protect your information.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="14" x="3" y="5" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="16" height="11" x="4" y="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.1 12s3.4-6 9.9-6 9.9 6 9.9 6-3.4 6-9.9 6-9.9-6-9.9-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.76-.07-1.49-.2-2.18H12v4.13h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.48Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.29l-3.24-2.51c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.59-4.12H3.06v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 14.03A6.02 6.02 0 0 1 6.1 12c0-.7.11-1.38.31-2.03v-2.6H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.63l3.35-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.85c1.47 0 2.79.51 3.83 1.5l2.86-2.86C16.96 2.88 14.7 2 12 2a10 10 0 0 0-8.94 5.37l3.35 2.6C7.2 7.61 9.4 5.85 12 5.85Z"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 5 6v5c0 4.7 3 8.5 7 10 4-1.5 7-5.3 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function DotPattern() {
  return (
    <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 10 }).map((__, col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * 15 + 8}
            cy={row * 14 + 8}
            r="1.3"
            fill={(row + col) % 3 === 0 ? "#ffb55f" : "#74a6ff"}
            opacity="0.55"
          />
        ))
      )}
    </svg>
  );
}
