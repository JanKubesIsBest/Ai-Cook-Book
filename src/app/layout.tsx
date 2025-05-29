import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import './base-style.css'
import { RecipeProvider } from "@/components/recipe-context/recipe-context";

export const metadata: Metadata = {
  title: "GPT Cook Book",
  description: "Create a meal from anything in fridge - with the use of our Ai!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <RecipeProvider>
        {children}
        </RecipeProvider>
      </body>
    </html>
  );
}
