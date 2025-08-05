"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { questionSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";

// Since the server now provides the user ID, we don't need a client-side
// User interface. The middleware ensures we are logged in.
type QuestionFormData = z.infer<typeof questionSchema>;

const AskQuestionPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  // The middleware protects this page, so we don't need a client-side check.
  // The server-side API call will verify the cookie.
  const onSubmit = handleSubmit(async (data) => {
    setError("");
    setSubmitting(true);

    try {
      const tagToSend = data.tag === "" ? null : data.tag;

      // The `userid` is now handled by the server-side logic in the `/api/ask` route.
      // We no longer need to pass it from the client.
      await axios.post(
        `/api/ask`,
        {
          title: data.title,
          description: data.description,
          tag: tagToSend,
        },
        {
          withCredentials: true, // Crucial for sending the httpOnly cookie
        }
      );
      router.push("/");
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
    <div className="container mx-auto my-5 p-4">
      <div className="flex flex-col items-center my-5">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Steps to write a good question
        </h3>
        <ul className="text-lg list-disc list-inside space-y-2 text-gray-700">
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>Review your question and post it to the site.</li>
        </ul>
      </div>

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

        <input
          type="text"
          placeholder="Title..."
          className="w-full p-4 my-2 rounded-xl text-lg border border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#fe8500] transition-all duration-300"
          {...register("title")}
        />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <textarea
          placeholder="Question Description..."
          className="w-full h-48 p-4 my-2 rounded-xl text-lg border border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#fe8500] transition-all duration-300 resize-y"
          {...register("description")}
        ></textarea>
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <input
          type="text"
          placeholder="Enter tag (optional)..."
          className="w-full p-4 my-2 rounded-xl text-lg border border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#fe8500] transition-all duration-300"
          {...register("tag")}
        />
        <ErrorMessage>{errors.tag?.message}</ErrorMessage>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full max-w-[200px] h-14 bg-[#516cf0] text-white rounded-md text-xl font-medium mt-6 hover:bg-[#fe8500] active:bg-[#516cf0] transition-colors duration-300 flex items-center justify-center gap-2 self-start"
        >
          {isSubmitting && <Spinner />}
          Post Your Question
        </button>
      </form>
    </div>
  );
};

export default AskQuestionPage;
