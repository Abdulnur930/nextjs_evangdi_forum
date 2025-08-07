import { NextResponse } from "next/server";
import prisma from "@/lib/client";
import { answerSchema } from "@/lib/validation";
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

    const validationResult = answerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: z.treeifyError(validationResult.error),
        },
        { status: 400 }
      );
    }

    const { questionid, answer } = validationResult.data;

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

    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { userid: authenticatedUserId },
    });

    if (!userExists) {
      return NextResponse.json(
        { message: "Unauthorized: User not found" },
        { status: 401 }
      );
    }

    // Create the new answer in the database
    const newAnswer = await prisma.answer.create({
      data: {
        answer: answer,
        userid: authenticatedUserId,
        questionid: questionid,
      },
    });

    return NextResponse.json(
      { message: "Answer posted successfully", answer: newAnswer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error posting answer:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
