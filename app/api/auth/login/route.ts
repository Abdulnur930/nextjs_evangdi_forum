import { NextResponse } from "next/server";
import prisma from "@/lib/client";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = loginSchema.safeParse(body);

    if (!result.success)
      return NextResponse.json(result.error.format(), { status: 400 });

    const { email, password } = result.data;

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Authenticated!
    return NextResponse.json({
      message: "Login successful",
      user: {
        userid: user.userid,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
