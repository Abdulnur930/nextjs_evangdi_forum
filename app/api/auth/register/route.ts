import { NextResponse } from "next/server";
import prisma from "@/lib/client";
import bcrypt from  "bcrypt"
import { registerSchema } from "@/lib/validation";
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validate input
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.format() },
        { status: 400 }
      );
    }

    const { username, email, password, firstname, lastname } = result.data;

    // ✅ Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username or email already taken" },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstname,
        lastname,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}