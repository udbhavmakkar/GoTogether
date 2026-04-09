import { NextResponse } from "next/server";

import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { validateGenderInput } from "@/lib/validators";

export async function PATCH(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    const body = (await request.json()) as { gender?: string | null };
    const validationError = validateGenderInput(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        gender: body.gender as "MALE" | "FEMALE" | "OTHER",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Please log in or register first.") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ error: "Unable to update profile." }, { status: 500 });
  }
}
