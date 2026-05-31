"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { registerUser } from "@/services/auth";
import {
  passwordRules,
  validateEmail,
  validatePassword,
} from "@/utils/validation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const evaluatedPasswordRules = useMemo(
    () =>
      passwordRules.map((rule) => ({
        label: rule.label,
        isValid: rule.test(password),
      })),
    [password],
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError("Please create a stronger password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerUser({
        email,
        name,
        password,
      });

      if (!result.user) {
        setError(result.error ?? "Unable to create account");
        return;
      }

      router.replace("/login?registered=1");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="hidden min-h-full bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Account setup
            </p>
            <h1 className="mt-5 max-w-md text-5xl font-bold leading-tight">
              Start with a secure account built for real project work.
            </h1>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Passwords must be strong and are stored as hashes in this mock
            frontend flow.
          </div>
        </div>

        <div className="flex items-center justify-center p-5 sm:p-8">
          <div className="auth-card">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
              Create account
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
              Register for SprintBoard
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Your password should be hard to guess and unique to this app.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Full name
                </span>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-field"
                  autoComplete="name"
                />
              </label>

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
                New accounts are created as Team Member accounts. Admin access is
                assigned only by the system owner.
              </div>

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

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Password
                  </span>
                  <input
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-field"
                    autoComplete="new-password"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Confirm password
                  </span>
                  <input
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-field"
                    autoComplete="new-password"
                  />
                </label>
              </div>

              <div className="rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-950">
                <p className="mb-3 font-medium text-slate-800 dark:text-slate-100">
                  Password must include:
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {evaluatedPasswordRules.map((rule) => (
                    <span
                      key={rule.label}
                      className={`flex items-center gap-2 ${
                        rule.isValid
                          ? "text-emerald-600 dark:text-emerald-300"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <span>{rule.isValid ? "OK" : "--"}</span>
                      {rule.label}
                    </span>
                  ))}
                </div>
              </div>

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
                {isSubmitting ? "Creating account..." : "Register"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
              Already registered?{" "}
              <Link href="/login" className="auth-link">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
