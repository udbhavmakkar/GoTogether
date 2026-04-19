"use client";

import { Button } from "@/components/ui/button";

export function ScrollToRidesButton() {
  function handleClick() {
    const element = document.getElementById("available-rides");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <Button variant="outline" size="lg" onClick={handleClick}>
      Available Rides
    </Button>
  );
}
