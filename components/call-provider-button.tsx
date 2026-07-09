"use client";

import { notifyProviderContact } from "@/api/client";

type CallProviderButtonProps = {
  providerId: string;
  phone: string;
};

export function CallProviderButton({ providerId, phone }: CallProviderButtonProps) {
  return (
    <a
      href={`tel:${phone.replace(/\s+/g, "")}`}
      onClick={() => notifyProviderContact(providerId)}
      className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      Call provider
    </a>
  );
}
