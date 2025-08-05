import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  try {
    const cookieName = "sessionToken";
    const serializedCookie = serialize(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Setting maxAge to 0 effectively deletes the cookie
      path: "/",
      sameSite: "lax",
    });

    const response = NextResponse.json(
      { message: "Signed out successfully" },
      { status: 200 }
    );

    response.headers.set("Set-Cookie", serializedCookie);
    return response;
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}