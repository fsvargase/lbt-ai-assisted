"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const DEMO_USERS = [
  { email: "client@example.com", role: "Client" },
  { email: "operator@example.com", role: "Operator" },
  { email: "driver.a@example.com", role: "Driver A" },
  { email: "driver.b@example.com", role: "Driver B" },
];

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setSubmitting(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <main className="mx-auto w-full max-w-sm px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
      <form
        onSubmit={handleSubmit}
        data-testid="signin-form"
        aria-label="Sign in"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            data-testid="signin-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            data-testid="signin-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          data-testid="signin-submit"
          disabled={submitting}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
        {error && (
          <p role="alert" data-testid="signin-error" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>

      <div className="mt-8 rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
        <p className="mb-2 font-medium text-gray-700">Demo users (password: password123)</p>
        <ul className="flex flex-col gap-1">
          {DEMO_USERS.map((u) => (
            <li key={u.email}>
              <button
                type="button"
                data-testid={`demo-${u.email}`}
                onClick={() => {
                  setEmail(u.email);
                  setPassword("password123");
                }}
                className="text-blue-600 underline"
              >
                {u.email}
              </button>{" "}
              — {u.role}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
