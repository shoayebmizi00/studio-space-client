"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { AuthShell } from "./auth-shell";

/* Google's multicolour "G" as an inline path set */
const googleMark = (
  <svg viewBox="0 0 18 18" className="size-4" aria-hidden>
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.97 10.71a5.41 5.41 0 0 1 0-3.42V4.97H.96a9 9 0 0 0 0 8.06l3.01-2.32z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.56-2.56A9 9 0 0 0 .96 4.97l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58z"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/* View                                                                */
/* ------------------------------------------------------------------ */

export function SignInView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/studios",
    });

    if (authError) {
      setError(
        authError.message || "Could not sign in. Is the auth server running?"
      );
      setLoading(false);
      return;
    }

    router.push("/studios");
  };

  const googleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/studios",
      });
      // Redirects to the provider — nothing to await afterwards.
    } catch {
      setError("Google sign-in is not available. Check the server setup.");
      setLoading(false);
    }
  };

  const iconField =
    "h-12 w-full rounded-xl border border-border/70 bg-background pl-10 pr-3.5 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/25";
  const iconPosition =
    "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground";

  return (
    <AuthShell>
      <span className="grid size-10 place-items-center rounded-xl bg-primary">
        <ArrowRight className="size-4 text-foreground" />
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-[13px] text-muted-foreground">
        Sign in to book studios or manage your listings.
      </p>

      <div className="mt-7 rounded-3xl border border-border/60 bg-card p-6 sm:p-7">
        <button
          type="button"
          disabled={loading}
          onClick={googleSignIn}
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border/70 bg-card text-[13px] font-medium transition-colors hover:border-foreground/25 disabled:opacity-60"
        >
          {googleMark}
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            OR
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={emailSignIn} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-[13px] font-semibold tracking-tight">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={iconField}
              />
              <Mail className={iconPosition} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="text-[13px] font-semibold tracking-tight">
                Password
              </label>
              <a
                href="#"
                className="text-xs font-medium text-[#9db922] transition-colors hover:text-[#8aa41c]"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className={iconField}
              />
              <Lock className={iconPosition} />
            </div>
          </div>

          {error ? (
            <p className="text-xs leading-relaxed text-red-600">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 h-11 w-full rounded-xl bg-primary text-[13px] font-semibold text-primary-foreground transition-all hover:brightness-95 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <p className="mt-5 text-center text-[13px] text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-foreground transition-opacity hover:opacity-70"
        >
          Create an account
        </Link>
      </p>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ArrowLeft className="size-3" />
        <Link href="/studios" className="transition-colors hover:text-foreground">
          Back to the marketplace
        </Link>
      </p>
    </AuthShell>
  );
}
