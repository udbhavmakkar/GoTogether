export const VIT_LOCATIONS = [
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

export const MENS_HOSTEL_BLOCKS = [
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
] as const;

export const LADIES_HOSTEL_BLOCKS = [
  "Ladies Hostel - A",
  "Ladies Hostel - B",
  "Ladies Hostel - C",
  "Ladies Hostel - D",
  "Ladies Hostel - E",
  "Ladies Hostel - F",
  "Ladies Hostel - G",
  "Ladies Hostel - H",
  "Ladies Hostel - J",
] as const;

export const EXTERNAL_LOCATIONS = [
  "Chennai Airport",
  "Bengaluru Airport",
  "Chitoor BusStand",
  "Katpadi Railway Station",
  "Green Circle",
  "CMC",
] as const;

export const ALL_LOCATIONS = [...VIT_LOCATIONS, ...EXTERNAL_LOCATIONS] as const;

export const TOTAL_SEAT_OPTIONS = [2, 3, 4, 5, 6] as const;
export const FILTER_LOCATIONS = [
  "VIT",
  ...EXTERNAL_LOCATIONS,
] as const;
export const CREATE_LOCATION_OPTIONS = [
  "VIT Mens Hostel",
  "VIT Ladies Hostel",
  "VIT Main Gate",
  "RGT",
  ...EXTERNAL_LOCATIONS,
] as const;

export type RideLocation = (typeof ALL_LOCATIONS)[number];
export type TotalSeatOption = (typeof TOTAL_SEAT_OPTIONS)[number];
export type LocationCategory = "vit" | "external";
export type FilterLocation = (typeof FILTER_LOCATIONS)[number];
export type CreateLocationOption = (typeof CREATE_LOCATION_OPTIONS)[number];

const VIT_LOCATION_SET = new Set<string>(VIT_LOCATIONS);
const EXTERNAL_LOCATION_SET = new Set<string>(EXTERNAL_LOCATIONS);

export function getLocationCategory(location?: string | null): LocationCategory | null {
  if (!location) {
    return null;
  }

  if (VIT_LOCATION_SET.has(location)) {
    return "vit";
  }

  if (location === "VIT Mens Hostel" || location === "VIT Ladies Hostel") {
    return "vit";
  }

  if (location === "VIT") {
    return "vit";
  }

  if (EXTERNAL_LOCATION_SET.has(location)) {
    return "external";
  }

  return null;
}

export function getLocationOptionsForSelection(selectedLocation?: string | null) {
  const selectedCategory = getLocationCategory(selectedLocation);

  if (selectedCategory === "vit") {
    return {
      primaryLabel: "Suggested destinations",
      primaryOptions: EXTERNAL_LOCATIONS,
      secondaryLabel: "Other locations",
      secondaryOptions: VIT_LOCATIONS,
    };
  }

  if (selectedCategory === "external") {
    return {
      primaryLabel: "Suggested destinations",
      primaryOptions: VIT_LOCATIONS,
      secondaryLabel: "Other locations",
      secondaryOptions: EXTERNAL_LOCATIONS,
    };
  }

  return {
    primaryLabel: "VIT locations",
    primaryOptions: VIT_LOCATIONS,
    secondaryLabel: "External locations",
    secondaryOptions: EXTERNAL_LOCATIONS,
  };
}

export function getPublicLocationLabel(location?: string | null) {
  const category = getLocationCategory(location);

  if (category === "vit") {
    return "VIT";
  }

  return location || "Unknown";
}

export function getPublicRideRoute(startLocation: string, destination: string) {
  return `${getPublicLocationLabel(startLocation)} -> ${getPublicLocationLabel(destination)}`;
}

export function getFilterLocationLabel(location?: string | null) {
  if (!location) {
    return "Unknown";
  }

  if (
    location === "VIT" ||
    location === "VIT Main Gate" ||
    location === "RGT" ||
    location.startsWith("Mens Hostel - ") ||
    location.startsWith("Ladies Hostel - ")
  ) {
    return "VIT";
  }

  return location;
}

export function getFilterLocationOptionsForSelection(selectedLocation?: string | null) {
  const selectedCategory = getLocationCategory(selectedLocation);

  if (selectedCategory === "vit") {
    return {
      primaryLabel: "Suggested destinations",
      primaryOptions: EXTERNAL_LOCATIONS,
      secondaryLabel: "Other locations",
      secondaryOptions: ["VIT"] as const,
    };
  }

  if (selectedCategory === "external") {
    return {
      primaryLabel: "Suggested destinations",
      primaryOptions: ["VIT"] as const,
      secondaryLabel: "Other locations",
      secondaryOptions: EXTERNAL_LOCATIONS,
    };
  }

  return {
    primaryLabel: "VIT locations",
    primaryOptions: ["VIT"] as const,
    secondaryLabel: "External locations",
    secondaryOptions: EXTERNAL_LOCATIONS,
  };
}

export function getHostelBlocksForOption(option?: string | null) {
  if (option === "VIT Mens Hostel") {
    return MENS_HOSTEL_BLOCKS;
  }

  if (option === "VIT Ladies Hostel") {
    return LADIES_HOSTEL_BLOCKS;
  }

  return [];
}

export function resolveCreateLocation(option?: string | null, hostelBlock?: string | null) {
  const hostelBlocks = getHostelBlocksForOption(option);

  if (hostelBlocks.length > 0) {
    return hostelBlock && hostelBlocks.some((block) => block === hostelBlock) ? hostelBlock : "";
  }

  return option || "";
}
