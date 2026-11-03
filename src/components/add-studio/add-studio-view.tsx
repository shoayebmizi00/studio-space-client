"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleUserRound,
  ImagePlus,
  Link2,
} from "lucide-react";
import {
  STEPS,
  TOTAL_STEPS,
  categoryOptions,
  amenityOptions,
  equipmentOptions,
  cancellationPolicies,
  initialForm,
  type AddStudioForm,
} from "@/lib/add-studio-data";
import { AmenityRow, AreaField, EquipmentChip, FieldShell, InfoNote, SelectField, TextField } from "./fields";

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const MAX_IMAGE_DIMENSION = 1920;
const IMAGE_QUALITY = 0.82;

// Reads the chosen file, shrinks it in a canvas, and returns it as a JPEG data URL.
function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        // Shrink very large photos so the saved JSON stays small.
        const scale = Math.min(
          1,
          MAX_IMAGE_DIMENSION / Math.max(image.width, image.height)
        );

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Could not process this image."));
          return;
        }

        // White background (helps transparent PNGs).
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
      };

      image.onerror = () => {
        reject(new Error("Could not read this image."));
      };

      image.src = reader.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Could not read this file."));
    };

    reader.readAsDataURL(file);
  });
}

// Returns the link if it starts with http:// or https://, otherwise null.
function checkImageUrl(text: string): string | null {
  const url = text.trim();
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return null;
}

/** Resolves only once the browser has actually decoded the image. */
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timer = window.setTimeout(
      () => reject(new Error("That link took too long to load. Try another one.")),
      10000
    );
    image.onload = () => {
      window.clearTimeout(timer);
      resolve();
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      reject(
        new Error(
          "That link could not be loaded as an image. Paste a URL that points directly at a .jpg, .png or .webp file."
        )
      );
    };
    image.src = url;
  });
}

function ImageTile({
  src,
  label,
  onRemove,
}: {
  src: string;
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="group relative size-28 overflow-hidden rounded-xl border border-border/70">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="size-full object-cover" />
      <Button
        type="button"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
        className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-white/90 text-[10px] text-foreground opacity-0 transition-opacity group-hover:opacity-100"
      >
        ✕
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* View                                                                */
/* ------------------------------------------------------------------ */

export function AddStudioView() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<AddStudioForm>(initialForm);
  // Amenities start pre-selected to mirror the reference state.
  const [amenities, setAmenities] = useState<string[]>([
    "Lighting",
    "Soundproofing",
    "Air Conditioning",
    "Makeup Room",
  ]);
  const [equipment, setEquipment] = useState<string[]>([
    "C-stands",
    "Mixing console",
    "Studio monitors",
    "Condenser microphones",
    "Camera & tripod",
    "Cyclorama",
  ]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [galleryImageUrl, setGalleryImageUrl] = useState("");
  const [customEquipment, setCustomEquipment] = useState("");
  const [sending, setSending] = useState(false);
  const [checkingUrl, setCheckingUrl] = useState<"cover" | "gallery" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof AddStudioForm>(key: K, value: AddStudioForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleItem = (list: string[], setList: (next: string[]) => void, item: string) => {
    setList(
      list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
    );
  };

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const pickCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    input.value = ""; // allow the same file to be picked again
    if (!file) return;

    try {
      setCoverImage(await readImageAsDataUrl(file));
      setError(null);
      toast.success("Cover image added", {
        description: "It will be saved when you publish the listing.",
      });
    } catch {
      setError(
        "Could not process that image — try a JPEG, PNG or WebP file. HEIC photos (iPhone) need converting to JPG first."
      );
    }
  };

  const pickGallery = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const files = Array.from(input.files ?? []);
    input.value = "";
    if (files.length === 0) return;
    const remaining = 6 - gallery.length;
    try {
      const dataUrls = await Promise.all(files.slice(0, remaining).map(readImageAsDataUrl));
      setGallery((prev) => [...prev, ...dataUrls].slice(0, 6));
      setError(null);
      toast.success(
        dataUrls.length === 1 ? "Photo added to gallery" : `${dataUrls.length} photos added to gallery`
      );
    } catch {
      setError(
        "Could not process those images — try JPEG, PNG or WebP files. HEIC photos (iPhone) need converting to JPG first."
      );
    }
  };

  const applyCoverImageUrl = async () => {
    const url = checkImageUrl(coverImageUrl);
    if (!url) {
      setError("Enter a valid image link beginning with http:// or https://.");
      return;
    }

    setCheckingUrl("cover");
    setError(null);
    try {
      await preloadImage(url);
      setCoverImage(url);
      setCoverImageUrl("");
      toast.success("Cover image added", {
        description: "The link loaded successfully.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "That link could not be loaded as an image.");
    } finally {
      setCheckingUrl(null);
    }
  };

  const addGalleryImageUrl = async () => {
    const url = checkImageUrl(galleryImageUrl);
    if (!url) {
      setError("Enter a valid image link beginning with http:// or https://.");
      return;
    }
    if (gallery.length >= 6) {
      setError("The gallery can contain up to 6 images.");
      return;
    }
    if (gallery.includes(url)) {
      setError("That image is already in the gallery.");
      return;
    }

    setCheckingUrl("gallery");
    setError(null);
    try {
      await preloadImage(url);
      setGallery((prev) => [...prev, url]);
      setGalleryImageUrl("");
      toast.success("Photo added to gallery");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That link could not be loaded as an image.");
    } finally {
      setCheckingUrl(null);
    }
  };

  const addCustomEquipment = () => {
    const trimmed = customEquipment.trim();
    if (trimmed && !equipment.includes(trimmed)) {
      setEquipment((prev) => [...prev, trimmed]);
    }
    setCustomEquipment("");
  };

  const publish = async () => {
    if (!form.name.trim()) {
      setError("Add a studio name before publishing.");
      setStep(1);
      return;
    }

    if (!coverImage) {
      setError(
        "A cover image is required — upload a photo or paste an image link before publishing."
      );
      setStep(4);
      return;
    }

    setSending(true);
    setError(null);
    try {
      // Save the listing through our own API route (JWT cookie protects it).
      const res = await fetch("/api/studios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          amenities,
          equipment,
          coverImage,
          gallery,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || `Server responded with ${res.status}`);
      }

      toast.success("Studio published", {
        description: `${form.name} is now live in the marketplace.`,
      });
      router.push("/my-listings");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not publish studio. Please try again."
      );
      toast.error("Could not publish studio", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  /* ---------------------------------------------------------------- */

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Add a studio</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Six steps to a live listing. Fill out your workspace details below to publish directly into the catalog.
      </p>

      {/* Listing identity banner */}
      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-muted/60 px-5 py-4">
        <CircleUserRound className="size-4 text-foreground/70" />
        {user ? (
          <p className="text-[13px] text-foreground/85">
            Listing as{" "}
            <span className="font-semibold text-foreground">{user.name || "Host"}</span>
            {" · "}
            {user.email}
          </p>
        ) : (
          <p className="text-[13px] text-foreground/85">
            Listing as a <span className="font-semibold text-foreground">Guest host</span>.{" "}
            <Link
              href="/sign-in?callbackUrl=/add-studio"
              className="font-medium underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Sign in
            </Link>{" "}
            to attach this studio to your account.
          </p>
        )}
      </div>

      {/* Wizard card */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-border/60 bg-card">
        {/* Progress header */}
        <div className="border-b border-border/60 p-6">
          <div className="mb-2.5 flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              Step {step} of {TOTAL_STEPS}
            </span>
            <span className="text-muted-foreground">{progress}% complete</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <h2 className="mt-5 text-xl font-semibold tracking-tight">
            {STEPS[step - 1].title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{STEPS[step - 1].subtitle}</p>
          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            >
              {error}
            </p>
          ) : null}
        </div>

        {/* Step body */}
        <div className="flex flex-col gap-5 p-6">
          {step === 1 ? (
            <>
              <TextField
                id="name"
                label="Studio name"
                hint="What creators will see in search results."
                value={form.name}
                onChange={(value) => set("name", value)}
              />
              <SelectField
                id="category"
                label="Category"
                value={form.category}
                onChange={(value) => set("category", value)}
                options={categoryOptions}
              />
              <TextField
                id="shortDescription"
                label="Short description"
                value={form.shortDescription}
                onChange={(value) => set("shortDescription", value)}
                hint={`${form.shortDescription.length}/160 characters — shown on cards.`}
              />
              <AreaField
                id="fullDescription"
                label="Full description"
                value={form.fullDescription}
                onChange={(value) => set("fullDescription", value)}
                hint="Layout, light, acoustics, what the space is best for."
              />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  id="country"
                  label="Country"
                  value={form.country}
                  onChange={(value) => set("country", value)}
                />
                <TextField
                  id="city"
                  label="City"
                  value={form.city}
                  onChange={(value) => set("city", value)}
                />
              </div>
              <TextField
                id="streetAddress"
                label="Street address"
                value={form.streetAddress}
                onChange={(value) => set("streetAddress", value)}
                hint="Only shared with a creator after you confirm their booking."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  id="latitude"
                  label="Latitude"
                  hint="Optional"
                  value={form.latitude}
                  onChange={(value) => set("latitude", value)}
                  placeholder="34.0407"
                />
                <TextField
                  id="longitude"
                  label="Longitude"
                  hint="Optional"
                  value={form.longitude}
                  onChange={(value) => set("longitude", value)}
                  placeholder="-118.2340"
                />
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  id="hourlyRate"
                  type="number"
                  label="Hourly rate (USD)"
                  value={form.hourlyRate}
                  onChange={(value) => set("hourlyRate", value)}
                />
                <TextField
                  id="securityDeposit"
                  type="number"
                  label="Security deposit (USD)"
                  hint="Refundable, charged with the booking."
                  value={form.securityDeposit}
                  onChange={(value) => set("securityDeposit", value)}
                />
              </div>
              <div>
                <TextField
                  id="maxCapacity"
                  type="number"
                  label="Maximum capacity"
                  hint="People allowed in the space at once."
                  value={form.maxCapacity}
                  onChange={(value) => set("maxCapacity", value)}
                />
              </div>
              <div className="rounded-xl bg-muted/60 p-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  Booking preview
                </p>
                <p className="mt-2 text-[13px] text-foreground/90">
                  A 3-hour booking earns{" "}
                  <span className="font-semibold">
                    ${Number(form.hourlyRate || 0) * 3}
                  </span>{" "}
                  plus a ${form.securityDeposit || 0} refundable deposit.
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  StudioSpace takes no commission during launch. You approve
                  every request before it is confirmed.
                </p>
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <FieldShell
                label="Cover image (required)"
                hint="Landscape, at least 1600px wide. Upload a photo or paste a link — publishing is blocked until a cover image is added."
              >
                {coverImage ? (
                  <ImageTile
                    src={coverImage}
                    label="cover image"
                    onRemove={() => setCoverImage(null)}
                  />
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    aria-label={coverImage ? "Replace cover image" : "Upload cover image"}
                    onClick={() => coverInputRef?.current?.click()}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-background px-3 text-[13px] transition-colors hover:border-foreground/30"
                  >
                    <ImagePlus className="size-4" />
                    {coverImage ? "Replace photo" : "Upload photo"}
                  </Button>
                </div>
                <Input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={pickCover}
                />
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Input
                    type="url"
                    value={coverImageUrl}
                    onChange={(event) => setCoverImageUrl(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        applyCoverImageUrl();
                      }
                    }}
                    placeholder="Paste cover image URL"
                    aria-label="Cover image URL"
                    className="h-10 min-w-0 flex-1 rounded-xl border border-border/70 bg-background px-3.5 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/25"
                  />
                  <Button
                    type="button"
                    onClick={applyCoverImageUrl}
                    disabled={checkingUrl !== null}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border/70 bg-card px-3 text-[13px] font-medium transition-colors hover:border-foreground/25 disabled:opacity-60"
                  >
                    <Link2 className="size-4" />
                    {checkingUrl === "cover" ? "Checking…" : "Use link"}
                  </Button>
                </div>
              </FieldShell>

              <FieldShell
                label="Gallery"
                hint="Up to 6 additional images. Files are stored publicly — anyone with the link can open them."
              >
                <div className="flex flex-wrap gap-3">
                  {gallery.map((src, index) => (
                    <ImageTile
                      key={`${index}-${src.length}`}
                      src={src}
                      label={`gallery photo ${index + 1}`}
                      onRemove={() =>
                        setGallery((prev) => prev.filter((_, i) => i !== index))
                      }
                    />
                  ))}
                  {gallery.length < 6 ? (
                    <Button
                      type="button"
                      aria-label="Add gallery photos"
                      onClick={() => galleryInputRef?.current?.click()}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-background px-3 text-[13px] transition-colors hover:border-foreground/30"
                    >
                      <ImagePlus className="size-4" />
                      Upload photos
                    </Button>
                  ) : null}
                </div>
                <Input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={pickGallery}
                />
                {gallery.length < 6 ? (
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Input
                      type="url"
                      value={galleryImageUrl}
                      onChange={(event) => setGalleryImageUrl(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addGalleryImageUrl();
                        }
                      }}
                      placeholder="Paste a gallery image URL"
                      aria-label="Gallery image URL"
                      className="h-10 min-w-0 flex-1 rounded-xl border border-border/70 bg-background px-3.5 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/25"
                    />
                    <Button
                      type="button"
                      onClick={addGalleryImageUrl}
                      disabled={checkingUrl !== null}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border/70 bg-card px-3 text-[13px] font-medium transition-colors hover:border-foreground/25 disabled:opacity-60"
                    >
                      <Link2 className="size-4" />
                      {checkingUrl === "gallery" ? "Checking…" : "Add link"}
                    </Button>
                  </div>
                ) : null}
              </FieldShell>

              <InfoNote>
                Strong listings mix a wide shot, a detail of the lighting, and
                the entrance. Photos are stored publicly so search results can
                load them quickly.
              </InfoNote>
            </>
          ) : null}

          {step === 5 ? (
            <>
              <div>
                <p className="mb-2 block text-[13px] font-semibold tracking-tight">Amenities</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {amenityOptions.map((amenity) => (
                    <AmenityRow
                      key={amenity}
                      icon={Check}
                      label={amenity}
                      active={amenities.includes(amenity)}
                      onClick={() => toggleItem(amenities, setAmenities, amenity)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 block text-[13px] font-semibold tracking-tight">Equipment</p>
                <div className="flex flex-wrap gap-2">
                  {equipmentOptions.map((item) => (
                    <EquipmentChip
                      key={item}
                      label={item}
                      active={equipment.includes(item)}
                      onClick={() => toggleItem(equipment, setEquipment, item)}
                    />
                  ))}
                  {equipment
                    .filter((item) => !equipmentOptions.includes(item as never))
                    .map((item) => (
                      <EquipmentChip
                        key={item}
                        label={item}
                        active
                        onClick={() => toggleItem(equipment, setEquipment, item)}
                      />
                    ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  type="text"
                  value={customEquipment}
                  onChange={(event) => setCustomEquipment(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCustomEquipment();
                    }
                  }}
                  placeholder="Add another piece of kit"
                  className="h-11 flex-1 rounded-xl border border-border/70 bg-background px-3.5 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/25"
                />
                <Button
                  type="button"
                  aria-label="Add custom equipment"
                  onClick={addCustomEquipment}
                  className="grid size-11 shrink-0 place-items-center rounded-xl border border-border/70 bg-card text-foreground/80 transition-colors hover:border-foreground/25"
                >
                  +
                </Button>
              </div>
            </>
          ) : null}

          {step === 6 ? (
            <>
              <AreaField
                id="rules"
                label="Studio rules"
                rows={5}
                value={form.rules}
                onChange={(value) => set("rules", value)}
                hint="Load-in, noise curfews, cleaning, what's not allowed."
              />
              <SelectField
                id="cancellationPolicy"
                label="Cancellation policy"
                value={form.cancellationPolicy}
                onChange={(value) => set("cancellationPolicy", value)}
                options={cancellationPolicies}
              />
              <InfoNote>
                Publishing makes the listing visible in search immediately. You
                control when it can actually be booked from the availability
                page — weekly hours and blocked dates are checked on every
                request.
              </InfoNote>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/60 p-5">
          <Button
            type="button"
            disabled={step === 1 || sending}
            onClick={() => {
              setError(null);
              setStep((prev) => Math.max(1, prev - 1));
            }}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold tracking-tight transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </Button>

          {step < TOTAL_STEPS ? (
            <Button
              type="button"
              onClick={() => {
                setError(null);
                setStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
              }}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-medium text-primary-foreground transition-transform hover:brightness-95 active:scale-[0.98]"
            >
              Continue
              <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled={sending}
              onClick={publish}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-medium text-primary-foreground transition-transform hover:brightness-95 active:scale-[0.98] disabled:opacity-60"
            >
              <Check className="size-3.5" />
              {sending ? "Publishing…" : "Publish studio"}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
