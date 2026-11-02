"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImagePlus, Mail, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

const fieldLabel = "mb-2 block text-[13px] font-semibold tracking-tight";
const fieldClass =
  "w-full rounded-xl border border-border/70 bg-card px-3.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/25";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  about: string;
  avatarUrl: string | null;
};

async function readAvatar(file: File): Promise<string> {
  const image = await createImageBitmap(file);
  const scale = Math.min(1, 512 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const context = canvas.getContext("2d");
  if (!context) {
    image.close();
    throw new Error("Could not process this photo.");
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Could not compress this photo.")), "image/jpeg", 0.8);
  });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read this photo."));
    reader.readAsDataURL(blob);
  });
}

export function ProfileView() {
  const { refetch: refreshSession } = useSession();
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    about: "",
    avatarUrl: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/profile", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load your profile.");
        if (active) {
          setProfile({
            name: data.user.name ?? "",
            email: data.user.email ?? "",
            phone: data.profile.phone ?? "",
            city: data.profile.city ?? "",
            about: data.profile.about ?? "",
            avatarUrl: data.profile.avatarUrl ?? data.user.image ?? null,
          });
        }
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load your profile.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const pickFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const avatarUrl = await readAvatar(file);
      setProfile((current) => ({ ...current, avatarUrl }));
      setError(null);
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : "Could not process this photo.");
    }
  };

  const updateField = (field: "name" | "phone" | "city" | "about", value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save your profile.");
      setProfile((current) => ({ ...current, ...data.profile }));
      await refreshSession();
      setSaved(true);
      toast.success("Profile updated");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Could not save your profile.";
      setError(message);
      toast.error("Profile could not be saved", { description: message });
    } finally {
      setSaving(false);
    }
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
          <Button
            type="button"
            disabled={loading || saving}
            onClick={() => fileRef.current?.click()}
            aria-label="Upload profile photo"
            className="group relative grid size-28 place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-background transition-colors hover:border-foreground/30"
          >
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
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
          </Button>
          <Input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            disabled={loading || saving}
            onChange={pickFile}
          />
          <p className="mt-3 max-w-md text-xs leading-relaxed text-muted-foreground">
            Square images look best. Files are stored publicly — anyone with
            the link can open them.
          </p>

          <form onSubmit={saveProfile} className="mt-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullName" className={fieldLabel}>
                  Full name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  disabled={loading || saving}
                  value={profile.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className={`${fieldClass} h-11`}
                />
              </div>
              <div>
                <Label htmlFor="phone" className={fieldLabel}>
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Optional"
                  disabled={loading || saving}
                  value={profile.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className={`${fieldClass} h-11`}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city" className={fieldLabel}>
                City
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="Where you usually create"
                disabled={loading || saving}
                value={profile.city}
                onChange={(event) => updateField("city", event.target.value)}
                className={`${fieldClass} h-11`}
              />
            </div>

            <div>
              <Label htmlFor="about" className={fieldLabel}>
                About you
              </Label>
              <Textarea
                id="about"
                name="about"
                rows={5}
                placeholder="A short introduction for hosts and collaborators"
                disabled={loading || saving}
                value={profile.about}
                onChange={(event) => updateField("about", event.target.value)}
                className={`${fieldClass} resize-y px-3.5 py-3`}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={loading || saving}
                className="h-10 rounded-xl bg-primary px-5 text-[13px] font-semibold text-primary-foreground transition-all hover:brightness-95 active:scale-[0.98] disabled:opacity-60"
              >
                {saving ? "Saving…" : saved ? "Profile saved" : "Save profile"}
              </Button>
              {saved ? (
                <span className="flex items-center gap-1.5 text-[13px] text-foreground/70">
                  <Check className="size-3.5 text-[#5a7a2e]" />
                  Your profile is up to date.
                </span>
              ) : null}
              {error ? <p className="text-[13px] text-red-600">{error}</p> : null}
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
                <span className="font-semibold tracking-tight">{loading ? "Loading profile…" : profile.email}</span>
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
