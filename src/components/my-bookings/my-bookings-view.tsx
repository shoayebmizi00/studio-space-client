"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  cancelBooking,
  deleteBooking,
  getBookings,
  updateBooking,
  type Booking,
  type BookingStatus,
} from "@/lib/bookings";

const statusTabs = ["All", "Pending", "Confirmed", "Completed", "Cancelled"] as const;
type StatusTab = (typeof statusTabs)[number];
type DialogMode = "details" | "edit" | "delete" | null;

const statusStyles: Record<BookingStatus, string> = {
  Pending: "border-amber-200 bg-amber-50 text-amber-800",
  Confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Completed: "border-border bg-muted text-muted-foreground",
  Cancelled: "border-red-200 bg-red-50 text-red-700",
};

function formatTime(value: string): string {
  const [hour, minute] = value.split(":").map(Number);
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatBookingDate(booking: Booking): string {
  const date = new Date(`${booking.date}T00:00:00`);
  const day = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${day} · ${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}`;
}

function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${statusStyles[status]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function MyBookingsView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<StatusTab>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    date: "",
    startTime: "",
    endTime: "",
    projectDetails: "",
  });

  useEffect(() => {
    let active = true;
    getBookings()
      .then((data) => {
        if (active) setBookings(data);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Could not load bookings.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredBookings = activeTab === "All"
    ? bookings
    : bookings.filter((booking) => booking.status === activeTab);

  const openDialog = (booking: Booking, mode: Exclude<DialogMode, null>) => {
    setSelected(booking);
    setDialogMode(mode);
    setActionError(null);
    setEditValues({
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      projectDetails: booking.projectDetails,
    });
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelected(null);
    setActionError(null);
  };

  const handleCancel = async (booking: Booking) => {
    setSaving(true);
    setActionError(null);
    try {
      const updated = await cancelBooking(booking.id);
      setBookings((current) => current.map((item) => item.id === updated.id ? updated : item));
      if (selected?.id === updated.id) setSelected(updated);
    } catch (cancelError) {
      setActionError(cancelError instanceof Error ? cancelError.message : "Could not cancel this booking.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setActionError(null);
    try {
      const updated = await updateBooking(selected.id, editValues);
      setBookings((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSelected(updated);
      setDialogMode("details");
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : "Could not update this booking.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    setActionError(null);
    try {
      await deleteBooking(selected.id);
      setBookings((current) => current.filter((item) => item.id !== selected.id));
      closeDialog();
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : "Could not delete this booking.");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    if (!selected) return;
    setEditValues({
      date: selected.date,
      startTime: selected.startTime,
      endTime: selected.endTime,
      projectDetails: selected.projectDetails,
    });
    setActionError(null);
    setDialogMode("edit");
  };

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My bookings</h1>
        <p className="mt-2 text-[13px] text-muted-foreground">
          Track every request, confirmed session and past shoot. Cancellations free the slot immediately.
        </p>
      </div>

      <div className="mt-6 flex w-full max-w-5xl items-center gap-1 overflow-x-auto rounded-full border border-border/70 bg-card p-1">
        {statusTabs.map((tab) => (
          <Button
            key={tab}
            type="button"
            aria-pressed={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`h-8 shrink-0 rounded-full px-4 text-[12px] font-normal transition-colors ${
              activeTab === tab
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {loading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Loading your bookings…</p>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <CalendarDays className="mx-auto size-6 text-muted-foreground" />
            <h2 className="mt-3 text-base font-semibold">No {activeTab === "All" ? "bookings" : activeTab.toLowerCase() + " bookings"} yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Your studio requests and sessions will appear here.</p>
            <Link href="/studios" className="mt-5 inline-flex h-9 items-center rounded-full bg-primary px-4 text-[13px] text-primary-foreground">
              Explore studios
            </Link>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <article key={booking.id} className="relative flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-4 sm:flex-row sm:items-center sm:gap-4 sm:px-3.5">
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-21.5 sm:w-29">
                {booking.studioImage ? (
                  <Image
                    src={booking.studioImage}
                    alt={booking.studioName}
                    fill
                    unoptimized
                    sizes="116px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid size-full place-items-center text-muted-foreground">
                    <MapPin className="size-5" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1 sm:pr-24">
                <h2 className="truncate text-[15px] font-semibold tracking-tight">{booking.studioName}</h2>
                <p className="mt-1 text-[12px] text-muted-foreground">{formatBookingDate(booking)}</p>
                <p className="mt-1 text-[12px] text-muted-foreground">Host: {booking.hostName || "Studio host"}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock3 className="size-3" />{booking.durationHours.toFixed(2)} hours</span>
                  <span className="font-semibold text-foreground">{money(booking.total)}</span>
                  <span className="font-mono text-[9px] uppercase">SS-{booking.id.slice(-8)}</span>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <Button type="button" onClick={() => openDialog(booking, "details")} className="h-7 rounded-full border border-border/70 bg-card px-3 text-[11px] font-normal hover:bg-muted">
                    View details
                  </Button>
                  {booking.status === "Pending" || booking.status === "Confirmed" ? (
                    <Button type="button" disabled={saving} onClick={() => handleCancel(booking)} className="h-7 rounded-full bg-transparent px-2.5 text-[11px] font-normal text-muted-foreground hover:bg-muted hover:text-foreground">
                      Cancel
                    </Button>
                  ) : null}
                  {booking.status === "Cancelled" ? (
                    <Button type="button" disabled={saving} onClick={() => openDialog(booking, "delete")} className="h-7 rounded-full bg-transparent px-2.5 text-[11px] font-normal text-muted-foreground hover:bg-red-50 hover:text-red-700">
                      Delete
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                <StatusBadge status={booking.status} />
              </div>
            </article>
          ))
        )}
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-lg rounded-2xl border border-border/70 bg-card p-6">
          {selected && dialogMode === "details" ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{selected.studioName}</DialogTitle>
                <DialogDescription>{formatBookingDate(selected)}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3 text-[13px]">
                <p><span className="text-muted-foreground">Status:</span> {selected.status}</p>
                <p><span className="text-muted-foreground">Host:</span> {selected.hostName}</p>
                <p><span className="text-muted-foreground">Location:</span> {[selected.city, selected.country].filter(Boolean).join(", ")}</p>
                <p><span className="text-muted-foreground">Duration:</span> {selected.durationHours.toFixed(2)} hours</p>
                <p><span className="text-muted-foreground">Rate:</span> {money(selected.hourlyRate)} / hour</p>
                <p><span className="text-muted-foreground">Security deposit:</span> {money(selected.securityDeposit)}</p>
                <p className="border-t border-border pt-3 font-semibold">Total: {money(selected.total)}</p>
                {selected.projectDetails ? <p className="whitespace-pre-wrap text-muted-foreground">{selected.projectDetails}</p> : null}
              </div>
              {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}
              <DialogFooter className="-mx-6 -mb-6 rounded-b-2xl">
                {selected.status === "Pending" ? (
                  <Button type="button" onClick={startEditing} className="h-9 rounded-xl border border-border/70 bg-card px-4 text-[13px]">Edit request</Button>
                ) : null}
                {selected.status === "Pending" || selected.status === "Confirmed" ? (
                  <Button type="button" disabled={saving} onClick={() => handleCancel(selected)} className="h-9 rounded-xl bg-transparent px-4 text-[13px] text-red-700 hover:bg-red-50">Cancel booking</Button>
                ) : null}
              </DialogFooter>
            </>
          ) : null}

          {selected && dialogMode === "edit" ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Edit booking request</DialogTitle>
                <DialogDescription>{selected.studioName}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="edit-booking-date" className="mb-2 block text-[13px] font-medium">Date</Label>
                  <Input id="edit-booking-date" type="date" min={new Date().toISOString().slice(0, 10)} value={editValues.date} onChange={(event) => setEditValues((value) => ({ ...value, date: event.target.value }))} className="h-10 rounded-xl border-border/70 bg-background text-[13px]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edit-booking-start" className="mb-2 block text-[13px] font-medium">Start</Label>
                    <Input id="edit-booking-start" type="time" value={editValues.startTime} onChange={(event) => setEditValues((value) => ({ ...value, startTime: event.target.value }))} className="h-10 rounded-xl border-border/70 bg-background text-[13px]" />
                  </div>
                  <div>
                    <Label htmlFor="edit-booking-end" className="mb-2 block text-[13px] font-medium">End</Label>
                    <Input id="edit-booking-end" type="time" value={editValues.endTime} onChange={(event) => setEditValues((value) => ({ ...value, endTime: event.target.value }))} className="h-10 rounded-xl border-border/70 bg-background text-[13px]" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-booking-details" className="mb-2 block text-[13px] font-medium">Project details</Label>
                  <Textarea id="edit-booking-details" rows={3} value={editValues.projectDetails} onChange={(event) => setEditValues((value) => ({ ...value, projectDetails: event.target.value }))} className="resize-y rounded-xl border-border/70 bg-background text-[13px]" />
                </div>
              </div>
              {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}
              <DialogFooter className="-mx-6 -mb-6 rounded-b-2xl">
                <Button type="button" onClick={() => setDialogMode("details")} className="h-9 rounded-xl border border-border/70 bg-card px-4 text-[13px]">Back</Button>
                <Button type="button" disabled={saving} onClick={handleSave} className="h-9 rounded-xl bg-primary px-4 text-[13px] text-primary-foreground">{saving ? "Saving…" : "Save changes"}</Button>
              </DialogFooter>
            </>
          ) : null}

          {selected && dialogMode === "delete" ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Delete cancelled booking?</DialogTitle>
                <DialogDescription>This removes the record for {selected.studioName} from your booking history.</DialogDescription>
              </DialogHeader>
              {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}
              <DialogFooter className="-mx-6 -mb-6 rounded-b-2xl">
                <Button type="button" onClick={closeDialog} className="h-9 rounded-xl border border-border/70 bg-card px-4 text-[13px]">Keep booking</Button>
                <Button type="button" disabled={saving} onClick={handleDelete} className="h-9 rounded-xl bg-red-600 px-4 text-[13px] text-white hover:bg-red-700">{saving ? "Deleting…" : "Delete"}</Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}