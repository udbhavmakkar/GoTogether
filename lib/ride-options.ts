export const PICKUP_POINTS = [
  "VIT Main Gate",
  "Mens Hostel - A",
  "Mens Hostel - B",
  "Mens Hostel - C",
  "Mens Hostel - D",
  "Mens Hostel - E",
  "Mens Hostel - F",
  "Mens Hostel - G",
  "Mens Hostel - H",
  "Mens Hostel - J",
  "Mens Hostel - K",
  "Mens Hostel - L",
  "Mens Hostel - M",
  "Mens Hostel - N",
  "Mens Hostel - P",
  "Mens Hostel - Q",
  "Mens Hostel - R",
  "Mens Hostel - S",
  "Mens Hostel - T",
  "Ladies Hostel - A",
  "Ladies Hostel - B",
  "Ladies Hostel - C",
  "Ladies Hostel - D",
  "Ladies Hostel - E",
  "Ladies Hostel - F",
  "Ladies Hostel - G",
  "Ladies Hostel - H",
  "Ladies Hostel - J",
  "RGT",
] as const;

export const DROP_LOCATIONS = [
  "Chennai Airport",
  "Bengaluru Airport",
  "Chitoor BusStand",
  "Katpadi Railway Station",
  "Green Circle",
  "CMC",
] as const;

export const TOTAL_SEAT_OPTIONS = [2, 3, 4, 5, 6] as const;

export type PickupPoint = (typeof PICKUP_POINTS)[number];
export type DropLocation = (typeof DROP_LOCATIONS)[number];
export type TotalSeatOption = (typeof TOTAL_SEAT_OPTIONS)[number];
