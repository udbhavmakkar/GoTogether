async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

export async function createRide(payload: {
  startLocation: string;
  destination: string;
  date: string;
  time: string;
  totalSeats: number;
  womenOnly?: boolean;
  notes?: string;
}) {
  return parseResponse<{ rideId: string }>(
    await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateProfileGender(gender: string) {
  return parseResponse<{ success: boolean }>(
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gender }),
    }),
  );
}

export async function joinRide(rideId: string) {
  return parseResponse<{ success: boolean }>(
    await fetch(`/api/rides/${rideId}/join`, {
      method: "POST",
    }),
  );
}

export async function leaveRide(rideId: string) {
  return parseResponse<{ success: boolean }>(
    await fetch(`/api/rides/${rideId}/leave`, {
      method: "DELETE",
    }),
  );
}

export async function deleteRide(rideId: string) {
  return parseResponse<{ success: boolean }>(
    await fetch(`/api/rides/${rideId}`, {
      method: "DELETE",
    }),
  );
}

export async function sendMessage(rideId: string, text: string) {
  return parseResponse<{ success: boolean }>(
    await fetch(`/api/rides/${rideId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }),
  );
}

export async function fetchMessages(rideId: string) {
  return parseResponse<{
    messages: Array<{
      id: string;
      text: string;
      createdAt: string;
      sender: {
        id: string;
        name: string;
      };
    }>;
  }>(await fetch(`/api/rides/${rideId}/messages`, { cache: "no-store" }));
}
