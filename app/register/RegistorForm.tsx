"use client";

import React, { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/app/components/ErrorMessage"; 
import Spinner from "@/app/components/Spinner"; 
import { registerSchema } from "@/lib/validation"; 
import { zodResolver } from "@hookform/resolvers/zod";
// import { User } from "@prisma/client"; // Assuming Prisma is set up and User type is available
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";

type RegisterFormData = z.infer<typeof registerSchema>;

const RegistorForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  // Consolidated onSubmit handler for form submission
  const onSubmit = handleSubmit(async (data) => {
    setError(""); // Clear previous general errors
    setSubmitting(true); // Indicate submission is in progress

    try {
      await axios.post("/api/auth/register", data);
      router.push("/login"); // Redirect on successful registration
    } catch (err) {
      // Handle different types of errors if needed, e.g., network errors, server response errors
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message); // Use message from server if available
      } else {
        setError("An unexpected error occurred. Please try again."); // General fallback
      }
    } finally {
      setSubmitting(false); // Indicate submission is complete
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
        type="text"
        placeholder="Username"
        {...register("username")}
      />
      {/* Display validation error for username */}
      <ErrorMessage>{errors.username?.message}</ErrorMessage>

      <div className="flex flex-col md:flex-row gap-x-2 mt-2">
        {" "}
        {/* Added mt-2 for spacing after username error */}
        <div className="flex-1">
          {" "}
          {/* Wrap inputs in a div for individual error messages */}
          <input
            className="input-field w-full h-12 mb-2 rounded-md border border-gray-400 px-3 text-base text-gray-800 placeholder-gray-500 focus:border-b-2 focus:border-[#ff8500] focus:outline-none transition-all duration-300 md:mr-1"
            type="text"
            placeholder="Firstname"
            {...register("firstname")}
          />
          {/* Display validation error for firstname */}
          <ErrorMessage>{errors.firstname?.message}</ErrorMessage>
        </div>
        <div className="flex-1">
          <input
            className="input-field w-full h-12 mb-2 rounded-md border border-gray-400 px-3 text-base text-gray-800 placeholder-gray-500 focus:border-b-2 focus:border-[#ff8500] focus:outline-none transition-all duration-300 md:ml-1"
            type="text"
            placeholder="Lastname"
            {...register("lastname")}
          />
          {/* Display validation error for lastname */}
          <ErrorMessage>{errors.lastname?.message}</ErrorMessage>
        </div>
      </div>

      <input
        className="input-field w-full h-12 mt-2 mb-2 rounded-md border border-gray-400 px-3 text-base text-gray-800 placeholder-gray-500 focus:border-b-2 focus:border-[#ff8500] focus:outline-none transition-all duration-300"
        type="email"
        placeholder="Email address"
        {...register("email")} // No `required` prop here, Zod handles validation
      />
      {/* Display validation error for email */}
      <ErrorMessage>{errors.email?.message}</ErrorMessage>

      <div className="relative mt-2">
        <input
          className="input-field w-full h-12 mb-2 rounded-md border border-gray-400 px-3 text-base text-gray-800 placeholder-gray-500 focus:border-b-2 focus:border-[#ff8500] focus:outline-none transition-all duration-300"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          placeholder="Password"
        />
        {/* Display validation error for password */}
        <ErrorMessage>{errors.password?.message}</ErrorMessage>

        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" // Adjusted top positioning to compensate for error message below input
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
        type="submit" 
        disabled={isSubmitting} 
        className="logSign bg-[#516cf0] w-full h-14 text-white rounded-md text-xl text-center mt-6 hover:bg-[#ff8500] active:border-3 active:border-[#516cf0] transition-colors duration-300 flex items-center justify-center gap-2"
      >
        {isSubmitting && <Spinner />} 
        Agree and Join
      </button>
    </form>
  );
};

export default RegistorForm;
