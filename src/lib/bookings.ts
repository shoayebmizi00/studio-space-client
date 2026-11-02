export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type Booking = {
  id: string;
  _id: string;
  userId: string;
  studioId: string;
  studioName: string;
  category?: string;
  studioImage: string | null;
  city: string;
  country: string;
  hostName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  hourlyRate: number;
  subtotal: number;
  securityDeposit: number;
  total: number;
  projectDetails: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};

type BookingInput = Pick<Booking, "studioId" | "date" | "startTime" | "endTime" | "projectDetails">;
type BookingUpdate = Pick<Booking, "date" | "startTime" | "endTime" | "projectDetails">;

async function responseData<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
  return data as T;
}

export async function getBookings(): Promise<Booking[]> {
  return responseData(await fetch("/api/bookings", { cache: "no-store" }));
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  return responseData(await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }));
}

export async function updateBooking(id: string, input: BookingUpdate): Promise<Booking> {
  return responseData(await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }));
}

export async function cancelBooking(id: string): Promise<Booking> {
  return responseData(await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Cancelled" }),
  }));
}

export async function deleteBooking(id: string): Promise<void> {
  const response = await fetch(`/api/bookings/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
}