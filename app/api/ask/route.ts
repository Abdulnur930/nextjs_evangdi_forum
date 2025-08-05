import { NextResponse } from "next/server";
import prisma from "@/lib/client";
import { questionSchema } from "@/lib/validation";
import { z } from "zod";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayload {
  userid: string;
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

    // Validate the incoming request data
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

    // Retrieve the cookie from the request headers
    const cookie = req.headers.get("cookie");
    const cookies =
      cookie?.split(";").reduce((acc, current) => {
        const [name, value] = current.trim().split("=");
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>) || {};

    const token = cookies["sessionToken"]; // Adjust to match your cookie name

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

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

    const authenticatedUserId = parseInt(decoded.userid, 10);

    if (isNaN(authenticatedUserId)) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid user ID in token payload" },
        { status: 401 }
      );
    }

    // Check if the user exists in the database
    const userExists = await prisma.user.findUnique({
      where: { userid: authenticatedUserId },
    });

    if (!userExists) {
      return NextResponse.json(
        { message: "Unauthorized: User not found" },
        { status: 401 }
      );
    }

    // Create the new question in the database
    const newQuestion = await prisma.question.create({
      data: {
        title,
        description,
        tag: tag || null,
        userid: authenticatedUserId,
      },
    });

    return NextResponse.json(
      { message: "Question posted successfully", question: newQuestion },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error posting question:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
