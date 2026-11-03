"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { API_URL } from "@/lib/api-url";
import { toast } from "sonner";
import {
  categoryOptions,
  amenityOptions,
  cancellationPolicies,
} from "@/lib/add-studio-data";
import { AreaField, EquipmentChip, FieldShell, SelectField, TextField } from "@/components/add-studio/fields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditForm = {
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  country: string;
  city: string;
  streetAddress: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  rules: string;
  cancellationPolicy: string;
  coverImage: string;
};

const emptyForm: EditForm = {
  name: "",
  category: "",
  shortDescription: "",
  fullDescription: "",
  country: "",
  city: "",
  streetAddress: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  rules: "",
  cancellationPolicy: "",
  coverImage: "",
};

export function EditStudioView() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [form, setForm] = useState<EditForm>(emptyForm);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof EditForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Load the current listing so the form starts pre-filled.
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(`${API_URL}/studios/${params.id}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("This listing could not be found.");
        }
        const studio = await res.json();
        if (!active) return;

        setForm({
          name: studio.name ?? "",
          category: studio.category ?? "",
          shortDescription: studio.shortDescription ?? "",
          fullDescription: studio.fullDescription ?? "",
          country: studio.country ?? "",
          city: studio.city ?? "",
          streetAddress: studio.streetAddress ?? "",
          hourlyRate: String(studio.hourlyRate ?? ""),
          securityDeposit: String(studio.securityDeposit ?? ""),
          maxCapacity: String(studio.maxCapacity ?? ""),
          rules: studio.rules ?? "",
          cancellationPolicy: studio.cancellationPolicy ?? "",
          coverImage: studio.coverImage ?? "",
        });
        setAmenities(Array.isArray(studio.amenities) ? studio.amenities : []);
        setGallery(Array.isArray(studio.gallery) ? studio.gallery : []);
        setHostName(studio.hostName ?? studio.ownerName ?? "");
        setHostEmail(studio.hostEmail ?? studio.ownerEmail ?? "");
      } catch (loadError) {
        if (active) {
          setLoadError(
            loadError instanceof Error ? loadError.message : "Could not load this listing."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [params.id]);

  const toggleAmenity = (amenity: string) => {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity]
    );
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Studio name is required");
      return;
    }

    setSaving(true);
    try {
      // Save the updated listing through our own API route.
      const res = await fetch(`/api/studios/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amenities,
          gallery,
          hostName,
          hostEmail,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Could not save your changes.");
      }

      toast.success("Listing updated", {
        description: `${form.name} has been saved.`,
      });
      router.push("/my-listings");
    } catch (saveError) {
      toast.error("Could not update listing", {
        description: saveError instanceof Error ? saveError.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <div className="animate-pulse rounded-3xl border border-border/60 bg-card p-8">
          <div className="h-7 w-1/2 rounded bg-muted" />
          <div className="mt-6 h-11 rounded-xl bg-muted" />
          <div className="mt-4 h-11 rounded-xl bg-muted" />
          <div className="mt-4 h-32 rounded-xl bg-muted" />
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-border/60 bg-card p-10 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Listing not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
          <Link
            href="/my-listings"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground"
          >
            Back to my listings
          </Link>
        </div>
      </main>
    );
  }

  const fieldClass =
    "w-full rounded-xl border border-border/70 bg-background px-3.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/25";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
      <Link
        href="/my-listings"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        My listings
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Update studio</h1>
      <p className="mt-2 text-[13px] text-muted-foreground">
        Change the details below and save. Your listing stays live in the marketplace.
      </p>

      <form onSubmit={save} className="mt-8 flex flex-col gap-6 rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
        {/* Read-only host info */}
        <div className="rounded-xl bg-muted/60 p-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Listed by
          </p>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[13px]">
            <span className="font-semibold text-foreground">{hostName || user?.name || "Host"}</span>
            <span className="text-muted-foreground">{hostEmail || user?.email || ""}</span>
          </div>
        </div>

        <TextField
          id="name"
          label="Studio title"
          value={form.name}
          onChange={(value) => set("name", value)}
          placeholder="e.g. Daylight Photo Studio"
        />

        <SelectField
          id="category"
          label="Category"
          value={form.category}
          onChange={(value) => set("category", value)}
          options={categoryOptions}
        />

        <AreaField
          id="shortDescription"
          label="Short summary"
          rows={2}
          value={form.shortDescription}
          onChange={(value) => set("shortDescription", value)}
          placeholder="One sentence that shows up on the card"
        />

        <AreaField
          id="fullDescription"
          label="Detailed overview"
          rows={6}
          value={form.fullDescription}
          onChange={(value) => set("fullDescription", value)}
          placeholder="Describe the space, the light, the gear and what it is best used for."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <TextField
            id="country"
            label="Country"
            value={form.country}
            onChange={(value) => set("country", value)}
            placeholder="Bangladesh"
          />
          <TextField
            id="city"
            label="City"
            value={form.city}
            onChange={(value) => set("city", value)}
            placeholder="Dhaka"
          />
          <TextField
            id="streetAddress"
            label="Street address"
            value={form.streetAddress}
            onChange={(value) => set("streetAddress", value)}
            placeholder="12 Lakeview Road"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <TextField
            id="hourlyRate"
            label="Hourly rate ($)"
            type="number"
            value={form.hourlyRate}
            onChange={(value) => set("hourlyRate", value)}
            placeholder="45"
          />
          <TextField
            id="securityDeposit"
            label="Security deposit ($)"
            type="number"
            value={form.securityDeposit}
            onChange={(value) => set("securityDeposit", value)}
            placeholder="100"
          />
          <TextField
            id="maxCapacity"
            label="Max capacity"
            type="number"
            value={form.maxCapacity}
            onChange={(value) => set("maxCapacity", value)}
            placeholder="8"
          />
        </div>

        {/* Cover image */}
        <FieldShell
          label="Cover image URL"
          hint="Paste a direct link to the main photo of your studio."
          htmlFor="coverImage"
        >
          <div className="flex gap-3">
            <Input
              id="coverImage"
              name="coverImage"
              type="url"
              value={form.coverImage}
              onChange={(event) => set("coverImage", event.target.value)}
              placeholder="https://example.com/studio.jpg"
              className={`${fieldClass} h-11`}
            />
          </div>
          {form.coverImage ? (
            <div className="relative mt-3 h-36 overflow-hidden rounded-xl bg-muted">
              <Image
                src={form.coverImage}
                alt="Cover preview"
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 448px"
                className="object-cover"
              />
            </div>
          ) : null}
        </FieldShell>

        {/* Amenities */}
        <div>
          <Label className="mb-2 block text-[13px] font-semibold tracking-tight">
            Amenities
          </Label>
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map((amenity) => (
              <EquipmentChip
                key={amenity}
                label={amenity}
                active={amenities.includes(amenity)}
                onClick={() => toggleAmenity(amenity)}
              />
            ))}
          </div>
        </div>

        <AreaField
          id="rules"
          label="House rules"
          rows={3}
          value={form.rules}
          onChange={(value) => set("rules", value)}
          placeholder="What guests should know before the session."
        />

        <SelectField
          id="cancellationPolicy"
          label="Cancellation policy"
          value={form.cancellationPolicy}
          onChange={(value) => set("cancellationPolicy", value)}
          options={cancellationPolicies}
        />

        <div className="flex flex-wrap gap-3 border-t border-border/60 pt-6">
          <Button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-[13px] font-semibold text-primary-foreground transition-transform hover:brightness-95 active:scale-[0.98] disabled:opacity-60"
          >
            <Save className="size-4" />
            {saving ? "Saving…" : "Save changes"}
          </Button>
          <Link
            href="/my-listings"
            className="inline-flex h-11 items-center rounded-full border border-border/70 bg-card px-6 text-[13px] font-medium transition-colors hover:border-foreground/30"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
