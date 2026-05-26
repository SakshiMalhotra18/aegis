import { prisma } from "@/lib/prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json(user);
  } catch (err: any) {
    console.error("Signup error:", err);
    
    // Prisma unique constraint violation (email already exists)
    if (err.code === 'P2002') {
      return NextResponse.json(
        { message: "This email address is already registered." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: `Database error: ${err.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
