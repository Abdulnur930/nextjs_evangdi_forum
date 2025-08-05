import { NextResponse } from "next/server";
import prisma from "@/lib/client";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/validation";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(z.treeifyError(result.error), { status: 400 });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // --- Authentication Successful ---

    const jwtSecret = process.env.JWT_SECRET || "your_super_secret_key_here";
    const tokenPayload = { userid: user.userid, username: user.username };
    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: "1h" });

    // 1. Serialize the cookie with the JWT
    const cookieName = "sessionToken";
    const serializedCookie = serialize(cookieName, token, {
      httpOnly: true, // Prevents client-side JS from reading it
      secure: process.env.NODE_ENV === "production", // Use secure in production
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
    });

    // 2. Create the response and set the cookie in the headers
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          userid: user.userid,
          username: user.username,
        },
      },
      { status: 200 }
    );

    response.headers.set("Set-Cookie", serializedCookie);

    // No need to return the token in the body, as the cookie is now the source of truth
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
