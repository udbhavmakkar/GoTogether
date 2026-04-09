import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="border-dashed border-slate-300 bg-white/70">
      <CardHeader>
        <CardTitle>No rides yet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-600">
        <p>Create the first ride and start coordinating with other students.</p>
        <Button asChild>
          <Link href="/create">Create Your First Ride</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
