import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "your_super_secret_key_here";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("sessionToken");

    if (!sessionToken) {
      // If there's no cookie, the user is not logged in.
      return NextResponse.json({ loggedIn: false }, { status: 200 });
    }

    // Verify the JWT and extract the payload to get the username
    const payload: any = jwt.verify(sessionToken.value, jwtSecret);

    return NextResponse.json(
      {
        loggedIn: true,
        username: payload.username,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session check error:", error);
    // If verification fails, the token is invalid or expired
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }
}
