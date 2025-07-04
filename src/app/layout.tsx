'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RecipeProvider } from "@/components/recipe-context/recipe-context";
import { StyledRoot } from "./createEmotionCache";
import GoogleAnalytics from "./GoogleAnalytics";

// const metadata: Metadata = {
//   title: "GPT Cook Book",
//   description: "Create a meal from anything in fridge - with the use of our Ai!",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/icon.ico" sizes="any"/>
      <body>
        <GoogleAnalytics />
        <StyledRoot>
          <RecipeProvider>{children}</RecipeProvider>
        </StyledRoot>
      </body>
    </html>
  );
}
