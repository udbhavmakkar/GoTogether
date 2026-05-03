import { NextResponse } from "next/server";

import { sendSupportFeedbackEmail } from "@/lib/email";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const name = body.name?.trim() || "";
    const email = body.email?.trim().toLowerCase() || "";
    const subject = body.subject?.trim() || "Feedback for GoTogether";
    const message = body.message?.trim() || "";

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (message.length < 5) {
      return NextResponse.json({ error: "Please enter a proper feedback message." }, { status: 400 });
    }

    await sendSupportFeedbackEmail({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_NOT_CONFIGURED") {
      return NextResponse.json(
        { error: "Support email is not configured yet. Please try again later." },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Unable to send feedback right now." }, { status: 500 });
  }
}
