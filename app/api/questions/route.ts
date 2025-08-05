import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Fetch all questions and include the associated user to get the username
    const allQuestions = await prisma.question.findMany({
      select: {
        id: true,
        questionid: true,
        title: true,
        description: true,
        tag: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    // We transform the data to match the expected structure in your front-end component,
    // which expects a 'username' field directly on the question object.
    const questionsWithUsernames = allQuestions.map((question) => ({
      ...question,
      username: question.user?.username,
    }));

    return NextResponse.json(questionsWithUsernames, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
