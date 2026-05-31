"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/auth";
import { validateEmail } from "@/utils/validation";

export default function LoginPage() {
  const router = useRouter();

  const { isAuthenticated, isAuthReady, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthReady && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthReady, isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await loginUser(email, password);

      if (!user) {
        setError("Invalid email or password");
        return;
      }

      login(user);
      router.replace("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="hidden min-h-full bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              SprintBoard
            </p>
            <h1 className="mt-5 max-w-md text-5xl font-bold leading-tight">
              Manage tasks, members, and project progress with confidence.
            </h1>
          </div>

          <div className="grid gap-4 text-sm text-slate-300">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              Secure sign-in keeps every workspace tied to a real account.
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              Create an account first, then use your credentials to login.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-5 sm:p-8">
          <div className="auth-card">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
              Login to SprintBoard
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Use the email and password you registered with.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email address
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-field"
                  autoComplete="email"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Password
                </span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-field"
                  autoComplete="current-password"
                />
              </label>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-action"
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
              <span>
                New here?{" "}
                <Link href="/register" className="auth-link">
                  Create account
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
