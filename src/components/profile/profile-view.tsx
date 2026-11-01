"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImagePlus, Mail, ShieldCheck, Check } from "lucide-react";

const fieldLabel = "mb-2 block text-[13px] font-semibold tracking-tight";
const fieldClass =
  "w-full rounded-xl border border-border/70 bg-card px-3.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/25";

export function ProfileView() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        How hosts and creators see you across StudioSpace.
      </p>

      <div className="mt-9 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-8">
        {/* Editable profile card */}
        <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-7">
          <h2 className={fieldLabel}>Profile photo</h2>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Upload profile photo"
            className="group relative grid size-28 place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-background transition-colors hover:border-foreground/30"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile preview"
                width={112}
                height={112}
                unoptimized
                className="size-28 object-cover"
              />
            ) : (
              <span className="flex flex-col items-center gap-2 px-2 text-center">
                <ImagePlus className="size-5 text-foreground/60 transition-colors group-hover:text-foreground" />
                <span className="text-[11px] text-foreground/70">Upload photo</span>
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={pickFile}
          />
          <p className="mt-3 max-w-md text-xs leading-relaxed text-muted-foreground">
            Square images look best. Files are stored publicly — anyone with
            the link can open them.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSaved(true);
            }}
            className="mt-6 flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={fieldLabel}>
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  defaultValue="Md Shoa-yeb"
                  className={`${fieldClass} h-11`}
                />
              </div>
              <div>
                <label htmlFor="phone" className={fieldLabel}>
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Optional"
                  className={`${fieldClass} h-11`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className={fieldLabel}>
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Where you usually create"
                className={`${fieldClass} h-11`}
              />
            </div>

            <div>
              <label htmlFor="about" className={fieldLabel}>
                About you
              </label>
              <textarea
                id="about"
                name="about"
                rows={5}
                placeholder="A short introduction for hosts and collaborators"
                className={`${fieldClass} resize-y px-3.5 py-3`}
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="h-10 rounded-xl bg-primary px-5 text-[13px] font-semibold text-primary-foreground transition-all hover:brightness-95 active:scale-[0.98]"
              >
                {saved ? "Profile saved" : "Save profile"}
              </button>
              {saved ? (
                <span className="flex items-center gap-1.5 text-[13px] text-foreground/70">
                  <Check className="size-3.5 text-[#5a7a2e]" />
                  Your profile is up to date.
                </span>
              ) : null}
            </div>
          </form>
        </section>

        {/* Account side cards */}
        <div className="flex flex-col gap-5 self-start">
          <section className="rounded-2xl border border-border/60 bg-card p-6">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Account
            </p>
            <p className="flex items-center gap-2.5 text-sm">
              <Mail className="size-4 shrink-0 text-foreground/60" />
              <span className="font-semibold tracking-tight">
                mdshoa-yeb1100@gmail.com
              </span>
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Your email is used for sign-in and booking notifications and
              can&apos;t be changed here.
            </p>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card p-6">
            <p className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
              <ShieldCheck className="size-4 text-foreground/70" />
              Account type
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Creator — you can book spaces. Add a studio to unlock hosting.
            </p>
            <Link
              href="/add-studio"
              className="mt-5 inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium transition-colors hover:border-foreground/25"
            >
              Become a host
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
