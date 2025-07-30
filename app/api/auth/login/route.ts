import { NextResponse } from "next/server";
import prisma from "@/lib/client";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/validation"; // Make sure this points to your loginSchema
import { z } from "zod";
import { serialize } from "cookie"; // Import the serialize function from 'cookie'

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      // Return detailed validation errors
      return NextResponse.json(z.treeifyError(result.error), { status: 400 });
    }

    const { email, password } = result.data;

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" }, // Changed 'error' to 'message' for consistency with client-side display
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" }, // Changed 'error' to 'message'
        { status: 401 }
      );
    }

    // ✅ Authenticated! Now, set the authentication cookie.

    // 1. Define your token (e.g., user ID, a session ID, or a JWT)
    // For simplicity, let's use the user ID. In a real app, you might generate a JWT.
    const authToken = user.userid.toString(); // Or a JWT: jwt.sign({ userId: user.userid }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 2. Serialize the cookie
    const cookieName = "sessionToken"; // Or 'auth_cookie', 'auth_token', etc.
    const serializedCookie = serialize(cookieName, authToken, {
      httpOnly: true, // Crucial: Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure in production (requires HTTPS)
      maxAge: 60 * 60 * 24 * 7, // 1 week (in seconds)
      path: "/", // Make the cookie available across the entire site
      sameSite: "lax", // Recommended for CSRF protection. Can be 'strict' or 'none' (with secure: true)
    });

    // 3. Create the NextResponse with the Set-Cookie header
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

    // Add the Set-Cookie header to the response
    response.headers.set("Set-Cookie", serializedCookie);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" }, // Changed 'error' to 'message'
      { status: 500 }
    );
  }
}
