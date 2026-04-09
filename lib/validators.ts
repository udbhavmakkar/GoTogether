import { DROP_LOCATIONS, PICKUP_POINTS, TOTAL_SEAT_OPTIONS } from "@/lib/ride-options";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isVitStudentEmail(email: string) {
  return email.toLowerCase().endsWith("@vitstudent.ac.in");
}

const allowedGenders = new Set(["MALE", "FEMALE", "OTHER"]);
const allowedPickupPoints = new Set(PICKUP_POINTS);
const allowedDropLocations = new Set(DROP_LOCATIONS);
const allowedSeatCounts = new Set(TOTAL_SEAT_OPTIONS);

function validateGender(gender?: string | null) {
  if (!gender || !allowedGenders.has(gender)) {
    return "Please select your gender.";
  }

  return null;
}

export function validateRideInput(input: {
  startLocation?: string;
  destination?: string;
  date?: string;
  time?: string;
  totalSeats?: number;
  womenOnly?: boolean;
  notes?: string;
  price?: number | null;
}) {
  if (!input.startLocation || !allowedPickupPoints.has(input.startLocation as (typeof PICKUP_POINTS)[number])) {
    return "Please select a valid pickup point.";
  }

  if (!input.destination || !allowedDropLocations.has(input.destination as (typeof DROP_LOCATIONS)[number])) {
    return "Please select a valid drop location.";
  }

  if (!input.date) {
    return "Departure date is required.";
  }

  if (!input.time) {
    return "Departure time is required.";
  }

  if (!input.totalSeats || !allowedSeatCounts.has(input.totalSeats as (typeof TOTAL_SEAT_OPTIONS)[number])) {
    return "Please select a valid sharing size.";
  }

  if (input.notes && input.notes.length > 300) {
    return "Notes must be under 300 characters.";
  }

  if (input.price != null && input.price < 0) {
    return "Price cannot be negative.";
  }

  return null;
}

export function validateProfileInput(input: { name?: string; email?: string }) {
  if (!input.name || input.name.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }

  if (!input.email || !isValidEmail(input.email)) {
    return "Please enter a valid email.";
  }

  if (!isVitStudentEmail(input.email)) {
    return "Only @vitstudent.ac.in email addresses are allowed.";
  }

  return null;
}

export function validateGenderInput(input: { gender?: string | null }) {
  return validateGender(input.gender);
}

function validatePassword(password?: string) {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return null;
}

export function validateRegistrationInput(input: { name?: string; email?: string; password?: string }) {
  const profileError = validateProfileInput(input);

  if (profileError) {
    return profileError;
  }

  return validatePassword(input.password);
}

export function validateLoginInput(input: { email?: string; password?: string }) {
  if (!input.email || !isValidEmail(input.email)) {
    return "Please enter a valid email.";
  }

  if (!isVitStudentEmail(input.email)) {
    return "Only @vitstudent.ac.in email addresses are allowed.";
  }

  return validatePassword(input.password);
}

export function validateMessage(text?: string) {
  if (!text || text.trim().length === 0) {
    return "Message cannot be empty.";
  }

  if (text.length > 400) {
    return "Message must be under 400 characters.";
  }

  return null;
}
