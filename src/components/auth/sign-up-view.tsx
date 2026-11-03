"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Lock, Mail, Image as ImageIcon, User, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "./auth-shell";

function getCallbackUrl(): string {
  const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
  return callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
    ? callbackUrl
    : "/studios";
}

/* Password rules from the assignment: uppercase, lowercase, min 6 chars. */
function passwordRules(password: string) {
  return [
    { label: "At least one uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "At least one lowercase letter", ok: /[a-z]/.test(password) },
    { label: "At least 6 characters", ok: password.length >= 6 },
  ];
}

/* ------------------------------------------------------------------ */
/* View                                                                */
/* ------------------------------------------------------------------ */

export function SignUpView() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const rules = passwordRules(password);
  const passwordIsValid = rules.every((rule) => rule.ok);

  const createAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!passwordIsValid) {
      toast.error("Password does not meet the requirements", {
        description: "Use an uppercase letter, a lowercase letter and at least 6 characters.",
      });
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await authClient.signUp.email({
        name: name.trim(),
        email,
        password,
        image: photoUrl.trim() || undefined,
        callbackURL: getCallbackUrl(),
      });

      if (authError) {
        toast.error("Could not create the account", {
          description: authError.message || "Try another email address.",
        });
        return;
      }

      toast.success("Account created", {
        description: "You can now sign in with your email and password.",
      });
      router.replace("/sign-in");
    } catch (authError) {
      toast.error("Could not create the account", {
        description:
          authError instanceof Error
            ? authError.message
            : "Check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const googleSignUp = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: getCallbackUrl(),
      });
      // Redirects to the provider — nothing to await afterwards.
    } catch (authError) {
      toast.error("Google sign-up is not available", {
        description:
          authError instanceof Error ? authError.message : "Check the server setup.",
      });
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
        <UserPlus className="size-4 text-foreground" />
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-2 text-[13px] text-muted-foreground">
        One account to book studios and host your own.
      </p>

      <div className="mt-7 rounded-3xl border border-border/60 bg-card p-6 sm:p-7">
        <Button
          type="button"
          disabled={loading}
          onClick={googleSignUp}
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border/70 bg-card text-[13px] font-medium transition-colors hover:border-foreground/25 disabled:opacity-60"
        >
          <svg viewBox="0 0 18 18" className="size-4" aria-hidden>
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.8.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18z"
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
          Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            OR
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={createAccount} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name" className="mb-2 block text-[13px] font-semibold tracking-tight">
              Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className={iconField}
              />
              <User className={iconPosition} />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="mb-2 block text-[13px] font-semibold tracking-tight">
              Email
            </Label>
            <div className="relative">
              <Input
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
            <Label htmlFor="photoUrl" className="mb-2 block text-[13px] font-semibold tracking-tight">
              Photo URL <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <div className="relative">
              <Input
                id="photoUrl"
                name="photoUrl"
                type="url"
                autoComplete="url"
                value={photoUrl}
                onChange={(event) => setPhotoUrl(event.target.value)}
                placeholder="https://example.com/me.jpg"
                className={iconField}
              />
              <ImageIcon className={iconPosition} />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="mb-2 block text-[13px] font-semibold tracking-tight">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className={iconField}
              />
              <Lock className={iconPosition} />
            </div>

            {/* Live password checklist */}
            <ul className="mt-2 flex flex-col gap-1">
              {rules.map((rule) => (
                <li
                  key={rule.label}
                  className={`flex items-center gap-1.5 text-xs ${
                    rule.ok ? "text-emerald-600" : "text-muted-foreground"
                  }`}
                >
                  {rule.ok ? (
                    <Check className="size-3" />
                  ) : (
                    <X className="size-3" />
                  )}
                  {rule.label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label htmlFor="confirm" className="text-[13px] font-semibold tracking-tight">
                Confirm Password
              </Label>
            </div>
            <div className="relative">
              <Input
                id="confirm"
                name="confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                placeholder="••••••••"
                className={iconField}
              />
              <Lock className={iconPosition} />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-1 h-11 w-full rounded-xl bg-primary text-[13px] font-semibold text-primary-foreground transition-all hover:brightness-95 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Register"}
          </Button>
        </form>
      </div>

      <p className="mt-5 text-center text-[13px] text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-foreground transition-opacity hover:opacity-70"
        >
          Login
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
