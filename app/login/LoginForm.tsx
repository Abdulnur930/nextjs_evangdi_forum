"use client";

import React, { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { loginSchema } from "@/lib/validation"; 
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  // Consolidated onSubmit handler for form submission
  const onSubmit = handleSubmit(async (data) => {
    setError(""); // Clear previous general errors
    setSubmitting(true); // Indicate submission is in progress

    try {
      await axios.post("/api/auth/login", data);
      router.push("/"); // Redirect to home on successful login
    } catch (err) {
      // Handle different types of errors if needed, e.g., network errors, server response errors
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message); // Use message from server if available
      } else {
        setError("An unexpected error occurred. Please try again."); // General fallback
      }
    } finally {
      setSubmitting(false); // End submission state regardless of success or failure
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      {/* Display general submission error message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <input
        className="input-field w-full h-12 mb-2 rounded-md border border-gray-400 px-3 text-base text-gray-800 placeholder-gray-500 focus:border-b-2 focus:border-[#ff8500] focus:outline-none transition-all duration-300"
        type="email"
        placeholder="Enter your email"
        {...register("email")}
      />
      {/* Display validation error for email */}
      <ErrorMessage>{errors.email?.message}</ErrorMessage>

      <div className="relative mt-2">
        <input
          className="input-field w-full h-12 mb-2 rounded-md border border-gray-400 px-3 text-base text-gray-800 placeholder-gray-500 focus:border-b-2 focus:border-[#ff8500] focus:outline-none transition-all duration-300"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          {...register("password")}
        />
        {/* Display validation error for password */}
        <ErrorMessage>{errors.password?.message}</ErrorMessage>

        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <Eye className="w-5 h-5 text-gray-600 hover:text-[#ff8500]" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-600 hover:text-[#ff8500]" />
          )}
        </span>
      </div>

      <button
        type="submit" // Changed to type="submit" for form submission
        disabled={isSubmitting} // Disable button while submitting
        className="logSign bg-[#516cf0] w-full h-14 text-white rounded-md text-xl text-center mt-6 hover:bg-[#ff8500] active:border-3 active:border-[#516cf0] transition-colors duration-300 flex items-center justify-center gap-2"
      >
        {isSubmitting && <Spinner />} {/* Show spinner if submitting */}
        Login
      </button>
    </form>
  );
};

export default LoginForm;
