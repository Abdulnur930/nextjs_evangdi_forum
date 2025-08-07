"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { answerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type AnswerFormData = z.infer<typeof answerSchema>;

const PostAnswer: React.FC = () => {
  const params = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
  });

  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setError("");
    setSubmitting(true);

    try {
      await axios.post(
        `/api/answers`,
        {
          answer: data.answer,
          questionid: [params.id],
        },
        {
          withCredentials: true, // Crucial for sending the httpOnly cookie
        }
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "An unexpected error occurred while posting your question. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  });

  return (
      <form
        onSubmit={onSubmit}
        className="question-container flex flex-col p-5 justify-between bg-white rounded-xl shadow-lg shadow-gray-200 min-h-[500px]"
      >
        <h3 className="text-2xl font-semibold mb-4 text-gray-800 items-center max-w-xl mx-auto">
          Ask a public question
        </h3>
        <NextLink className="items-center max-w-xl mx-auto" href="/" passHref>
          <span className="text-black hover:text-[#fe8500] hover:underline mb-4 inline-block ">
            Go to Question page
          </span>
        </NextLink>

        {error && <ErrorMessage>{error}</ErrorMessage>}
          <textarea
            placeholder="Your answer..."
            className="w-full min-h-[150px] max-h-[300px] p-4 border border-gray-300 rounded-lg focus:outline-none text-base"
            {...register("answer")}
          ></textarea>
          <ErrorMessage>{errors.answer?.message}</ErrorMessage>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-48 h-12 bg-indigo-600 text-white rounded-md hover:bg-orange-500 transition flex items-center justify-center"
          >
            {isSubmitting && <Spinner />}
            Post Your Answer
          </button>
      </form>
  );
};

export default PostAnswer;
