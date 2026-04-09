export const genderLabels = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
} as const;

export const genderOptions = Object.entries(genderLabels).map(([value, label]) => ({
  value,
  label,
}));
