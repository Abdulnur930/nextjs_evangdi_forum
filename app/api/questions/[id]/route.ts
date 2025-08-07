import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/client";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;

    // Fetch the question and its related answers and users in a single query
    const question = await prisma.question.findUnique({
      where: { questionid: questionId },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        answers: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { message: "Question not found." },
        { status: 404 }
      );
    }

    // Transform the data to include usernames directly on the question and answer objects
    const formattedQuestion = {
      ...question,
      username: question.user?.username,
      answers: question.answers.map((answer) => ({
        ...answer,
        username: answer.user?.username,
      })),
    };

    return NextResponse.json(formattedQuestion, { status: 200 });
  } catch (error) {
    console.error("Error fetching question and answers:", error);
    return NextResponse.json(
      { message: "Failed to fetch question and answers." },
      { status: 500 }
    );
  }
}
