"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

/**
 * Newsletter box in the footer. A beginner-friendly form: on submit we
 * validate the email and show a Sonner toast — no page reload.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const subscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();

    if (!value || !value.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }

    toast.success("You are on the list!", {
      description: `Studio news will be sent to ${value}.`,
    });
    setEmail("");
  };

  return (
    <form onSubmit={subscribe} className="mt-5 w-full max-w-xs">
      <label
        htmlFor="newsletter-email"
        className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
      >
        Newsletter
      </label>
      <div className="mt-2 flex items-center gap-2 rounded-full border border-border/70 bg-card p-1 pl-4 focus-within:border-foreground/25">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Subscribe to the newsletter"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground text-primary transition-transform hover:brightness-110 active:scale-95"
        >
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </form>
  );
}
