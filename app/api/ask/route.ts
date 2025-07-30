import { NextResponse } from "next/server";
import prisma from "@/lib/client"; // Your Prisma client
import { questionSchema } from "@/lib/validation"; // Your Zod schema
import { z } from "zod"; // Zod library
import jwt from "jsonwebtoken"; // For JWT verification

// Define your JWT secret (ensure it's in your .env.local file)
const JWT_SECRET = process.env.JWT_SECRET;

// Type for the decoded JWT payload
interface JwtPayload {
  userId: string; // The user ID stored in your JWT
  // Add other properties if your JWT contains them
}

export async function POST(req: Request) {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return NextResponse.json(
      { message: "Server configuration error." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    // 1. Server-side validation using Zod
    const validationResult = questionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: z.treeifyError(validationResult.error),
        },
        { status: 400 }
      );
    }

    const { title, description, tag } = validationResult.data;

    // 2. Authenticate and Authorize User via Bearer Token
    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authorizationHeader.split(" ")[1]; // Extract the token part

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (tokenError) {
      console.error("Token verification failed:", tokenError);
      return NextResponse.json(
        { message: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

    // Ensure the decoded token has a userId
    if (!decoded.userId) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token payload" },
        { status: 401 }
      );
    }

    const authenticatedUserId = decoded.userId;

    // Optional: Verify if the user ID from the token actually exists in your database
    const userExists = await prisma.user.findUnique({
      where: { userid: authenticatedUserId },
    });

    if (!userExists) {
      return NextResponse.json(
        { message: "Unauthorized: User not found" },
        { status: 401 }
      );
    }

    // 3. Save the question to the database
    const newQuestion = await prisma.question.create({
      data: {
        title,
        description,
        tag: tag || null, // Ensure tag is null if empty string (Zod transform already handles this, but good for clarity)
        userid: authenticatedUserId, // Use the authenticated user's ID
      },
    });

    // 4. Return success response
    return NextResponse.json(
      { message: "Question posted successfully", question: newQuestion },
      { status: 201 } // 201 Created is appropriate for new resource creation
    );
  } catch (error) {
    console.error("Error posting question:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
