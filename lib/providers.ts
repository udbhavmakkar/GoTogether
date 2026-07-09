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
    id: "waseem-taxis",
    name: "Waseem Taxis",
    phone: "8147199409",
    cabTypes: ["Taxi service"],
    pricing: [
      {
        label: "Chennai to Vellore",
        price: "2500/-",
      },
      {
        label: "Bangalore to Vellore",
        originalPrice: "5000/-",
        price: "4200/-",
      },
    ],
    notes:
      'While talking to the person, take the name of "GoTogether website" and they will give a discount. Any review of this person, put it in the suggestion/feedback box in the website.',
  },
  {
    id: "ganesh-taxis",
    name: "Ganesh Taxis",
    phone: "7829976680",
    cabTypes: ["Taxi service"],
    pricing: [
      {
        label: "Chennai to Vellore",
        price: "2100/-",
      },
    ],
    notes:
      'While talking to the person, take the name of "GoTogether website" and they will give a discount. Any review of this person, put it in the suggestion/feedback box in the website.',
  },
];

export function getProviderById(providerId: string) {
  return providers.find((provider) => provider.id === providerId) ?? null;
}
