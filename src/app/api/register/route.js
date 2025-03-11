import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { AUTH_MESSAGES, GENERAL_MESSAGES } from "@/app/constants";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: AUTH_MESSAGES.EMAIL_EXISTS },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error || GENERAL_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}