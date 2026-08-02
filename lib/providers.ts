export type ProviderPricing = {
  label: string;
  originalPrice?: string;
  price: string;
};

export type Provider = {
  id: string;
  name: string;
  phone: string;
  cabTypes: string[];
  pricing: ProviderPricing[];
  notes?: string;
};

export const providers: Provider[] = [
  {
    id: "ganesh-taxis",
    name: "Ganesh Taxis",
    phone: "7829976680",
    cabTypes: ["Taxi service"],
    pricing: [
      {
        label: "Bangalore Airport to VIT",
        price: "4200/-",
      },
      {
        label: "VIT to Bangalore Airport",
        price: "4200/-",
      },
      {
        label: "VIT to Chennai Airport",
        price: "2300/-",
      },
      {
        label: "Chennai Airport to VIT",
        price: "2300/-",
      },
    ],
    notes:
      'While talking to the person, take the name of "GoTogether website" and they will give a discount. Any review of this person, put it in the suggestion/feedback box in the website.',
  },
];

export function getProviderById(providerId: string) {
  return providers.find((provider) => provider.id === providerId) ?? null;
}
