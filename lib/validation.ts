import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().nonempty("Password is required"),
});
export const questionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title is too long" }),
  description: z.string().min(1, { message: "Description is required" }),
  tag: z.string().max(50, { message: "Tag is too long" }).nullable().optional(),
});

export const answerSchema = z.object({
  questionid: z.string().nonempty("Question ID is required."),
  answer: z.string().min(1, { message: "Answer is required" }),
});