export type ProviderPricing = {
  label: string;
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

export const providers: Provider[] = [];
