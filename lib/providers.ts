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
    id: "latif-taxis",
    name: "Latif Taxis (MyVelloreTaxis)",
    phone: "+91 8270888555",
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
        price: "From 2500/-",
      },
      {
        label: "Chennai Airport to VIT",
        price: "From 2500/-",
      },
    ],
    notes:
      'Fares may rise during Diwali and vary with demand. Mention "GoTogether" on the call to receive our agreed discount with Latif Taxis. Confirm the final fare directly before booking. You can share your experience through our feedback page.',
  },
];

export function getProviderById(providerId: string) {
  return providers.find((provider) => provider.id === providerId) ?? null;
}
