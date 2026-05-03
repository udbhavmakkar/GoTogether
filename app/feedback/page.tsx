import { FeedbackForm } from "@/components/feedback-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Feedback</h1>
        <p className="text-sm text-slate-600">
          Send your questions, bug reports, or suggestions to the GoTogether support mailbox.
        </p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Contact support</CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackForm defaultName={currentUser?.name} defaultEmail={currentUser?.email} />
        </CardContent>
      </Card>
    </div>
  );
}
