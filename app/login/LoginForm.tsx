"use client";

import React, { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { loginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  // We remove the 'useRouter' hook because we will use a full page reload.
  // const router = useRouter();

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

  const onSubmit = handleSubmit(async (data) => {
    setError("");
    setSubmitting(true);

    try {
      await axios.post("/api/auth/login", data);

      // --- FIX: Replace router.push with a full page reload ---
      // This ensures the cookie is properly set and all components re-render correctly.
      // This solves the issue of the "Ask a question" page failing on the first attempt after login.
      window.location.href = "/";
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <input
        className="input-field w-full h-12 mb-2 rounded-md border border-gray-400 px-3 text-base text-gray-800 placeholder-gray-500 focus:border-b-2 focus:border-[#ff8500] focus:outline-none transition-all duration-300"
        type="email"
        placeholder="Enter your email"
        {...register("email")}
      />
      <ErrorMessage>{errors.email?.message}</ErrorMessage>

      <div className="relative mt-2">
        <input
          className="input-field w-full h-12 mb-2 rounded-md border border-gray-400 px-3 text-base text-gray-800 placeholder-gray-500 focus:border-b-2 focus:border-[#ff8500] focus:outline-none transition-all duration-300"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          {...register("password")}
        />
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
        type="submit"
        disabled={isSubmitting}
        className="logSign bg-[#516cf0] w-full h-14 text-white rounded-md text-xl text-center mt-6 hover:bg-[#ff8500] active:border-3 active:border-[#516cf0] transition-colors duration-300 flex items-center justify-center gap-2"
      >
        {isSubmitting && <Spinner />}
        Login
      </button>
    </form>
  );
};

export default LoginForm;
