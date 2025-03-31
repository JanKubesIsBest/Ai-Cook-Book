"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface RecipeItemProps {
  title: string;
  description: string;
  ingredients: string[];
  isLastItem?: boolean;
}

interface RecipeContextType {
  selectedRecipe: RecipeItemProps | null;
  setSelectedRecipe: (recipe: RecipeItemProps | null) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItemProps | null>(null);

  useEffect(() => {
    console.log("recipe changed", selectedRecipe);
  }, [selectedRecipe]); // Corrected dependency array

  return (
    <RecipeContext.Provider value={{ selectedRecipe, setSelectedRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};