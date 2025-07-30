
"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link"; // Alias Next.js Link
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";

import ErrorMessage from "@/app/components/ErrorMessage"; // Ensure this path is correct
import Spinner from "@/app/components/Spinner"; // Ensure this path is correct
import {
  questionSchema,
  type QuestionFormData,
} from "@/lib/validation"; // Import schema and type

// Simulate user context/token for demonstration.
// In a real app, this would come from a secure authentication context or server-side props.
interface User {
  userid: string; // Assuming userid is a string
  // ... other user properties
}

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

  // --- IMPORTANT: User and Token Handling ---
  // In a real Next.js app, avoid localStorage for sensitive tokens.
  // Instead, manage sessions using HttpOnly cookies set by your API,
  // and access user info via a client-side context or server-side props.
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // This is a simplified client-side retrieval.
    // Replace with your actual authentication context or session retrieval.
    const storedToken = localStorage.getItem("sessionToken"); // Assuming 'sessionToken' is the cookie name
    const storedUser = localStorage.getItem("user"); // Assuming user data is stored

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
      }
    }
  }, []);
  // --- END IMPORTANT ---

  const onSubmit = handleSubmit(async (data) => {
    setError(""); // Clear previous general errors
    setSubmitting(true); // Indicate submission is in progress

    // Ensure user and token are available before proceeding
    if (!user?.userid || !token) {
      setError("User not authenticated. Please log in.");
      setSubmitting(false);
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      await axios.post(
        `/api/questions/askquestion`, // Assuming your API endpoint is /api/questions/askquestion
        {
          userid: user.userid,
          title: data.title,
          description: data.description,
          tag: data.tag || null, // Ensure tag is null if empty string
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/"); // Redirect to home on successful question post
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "An unexpected error occurred while posting your question. Please try again."
        );
      }
    } finally {
      setSubmitting(false); // End submission state
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
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Ask a public question
        </h3>
        <NextLink href="/" passHref>
          <span className="text-black hover:text-[#fe8500] hover:underline mb-4 inline-block">
            Go to Question page
          </span>
        </NextLink>

        {/* Display general submission error message */}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <input
          type="text"
          placeholder="Title..."
          className="w-full p-4 my-2 rounded-xl text-lg border border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#fe8500] transition-all duration-300"
          {...register("title")}
        />
        {/* Display validation error for title */}
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <textarea
          placeholder="Question Description..."
          className="w-full h-48 p-4 my-2 rounded-xl text-lg border border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#fe8500] transition-all duration-300 resize-y"
          {...register("description")}
        ></textarea>
        {/* Display validation error for description */}
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <input
          type="text"
          placeholder="Enter tag (optional)..."
          className="w-full p-4 my-2 rounded-xl text-lg border border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#fe8500] transition-all duration-300"
          {...register("tag")}
        />
        {/* Display validation error for tag */}
        <ErrorMessage>{errors.tag?.message}</ErrorMessage>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full max-w-[200px] h-14 bg-[#516cf0] text-white rounded-md text-xl font-medium mt-6 hover:bg-[#fe8500] active:bg-[#516cf0] transition-colors duration-300 flex items-center justify-center gap-2 self-start" // self-start to align left
        >
          {isSubmitting && <Spinner />}
          Post Your Question
        </button>
      </form>
    </div>
  );
};

export default AskQuestionPage;