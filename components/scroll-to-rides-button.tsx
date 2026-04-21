"use client";

import { Button } from "@/components/ui/button";

export function ScrollToRidesButton({ label = "Available Rides" }: { label?: string }) {
  function handleClick() {
    const element = document.getElementById("available-rides");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <Button variant="outline" size="lg" onClick={handleClick}>
      {label}
    </Button>
  );
}
