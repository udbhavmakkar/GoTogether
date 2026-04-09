import { format } from "date-fns";

export function formatRideDate(date: Date) {
  return format(date, "EEE, d MMM yyyy");
}

export function formatRideTimestamp(date: Date) {
  return format(date, "d MMM yyyy, h:mm a");
}
