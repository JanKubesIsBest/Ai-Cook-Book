"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { RecipeItemProps, Recipe } from "@/utils/together-api/recipe-utils";

interface RecipeContextType {
  selectedRecipe: RecipeItemProps | null;
  setSelectedRecipe: (recipe: RecipeItemProps | null) => void;
  searchResults: Record<string, Recipe[] | null>;
  setSearchResults: (keyword: string, results: Recipe[] | null) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItemProps | null>(null);
  const [searchResults, setSearchResults] = useState<Record<string, Recipe[] | null>>({});

  const handleSetSearchResults = (keyword: string, results: Recipe[] | null) => {
    setSearchResults((prev) => ({ ...prev, [keyword]: results }));
  };

  return (
    <RecipeContext.Provider
      value={{
        selectedRecipe,
        setSelectedRecipe,
        searchResults,
        setSearchResults: handleSetSearchResults,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipeContext must be used within a RecipeProvider");
  }
  return context;
}