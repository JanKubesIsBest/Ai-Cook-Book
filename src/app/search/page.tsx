"use client";

import React, { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import SearchComponent from "@/components/search/search-component"; // Assuming this is now fully MUI
import RecipeItem from "@/components/recipe-item/recipe-item"; // Assuming this is either MUI or its styling is handled internally
import { useRecipeContext } from "@/components/recipe-context/recipe-context";
import { searchRecipe } from "@/utils/together-api/actions";
import { Recipe } from "../../utils/together-api/interfaces";

// MUI Imports
import { Box, Typography, Container } from '@mui/material';

function SearchPageContent() {
  const { searchResults, setSearchResults, setSelectedRecipe } = useRecipeContext();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingDots, setLoadingDots] = useState<string>("");
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [currentDisplayQuery, setCurrentDisplayQuery] = useState<string>(initialQuery);

  const hasPerformedInitialSearch = useRef(false);

  const performSearch = useCallback(
    async (query: string) => {
      if (!query) {
        setRecipes([]);
        setSearchPerformed(true);
        setIsLoading(false);
        setCurrentDisplayQuery("");
        return;
      }

      const differentQuery = query !== currentDisplayQuery;

      if (!differentQuery && searchResults[query] !== undefined) {
        setRecipes(searchResults[query] || []);
        setSearchPerformed(true);
        setIsLoading(false);
        setCurrentDisplayQuery(query);
        return;
      }

      setSearchPerformed(true);
      setIsLoading(true);
      setRecipes([]);
      setCurrentDisplayQuery(query);

      try {
        const fetchedRecipes = await searchRecipe(query);
        const recipesToSet: Recipe[] = fetchedRecipes || [];
        setRecipes(recipesToSet);
        setSearchResults(query, recipesToSet);
      } catch (error) {
        console.error("Search failed:", error);
        setRecipes([]);
        setSearchResults(query, []);
      } finally {
        setIsLoading(false);
      }
    },
    [searchResults, setSearchResults, currentDisplayQuery] // Added currentDisplayQuery to dependencies
  );

  useEffect(() => {
    if (hasPerformedInitialSearch.current) {
      return;
    }

    if (initialQuery) {
      hasPerformedInitialSearch.current = true;
      performSearch(initialQuery);
    } else {
      setSearchPerformed(false);
      setRecipes([]);
      setCurrentDisplayQuery("");
    }
  }, [initialQuery, performSearch]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isLoading) {
      intervalId = setInterval(() => {
        setLoadingDots((dots) => (dots.length >= 3 ? "" : dots + "."));
      }, 400);
    } else {
      setLoadingDots("");
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoading]);

  const handleNewSearch = (newQuery: string) => {
    performSearch(newQuery);
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(newQuery)}`);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe({
      title: recipe.title,
      description: recipe.descriptionItems,
      ingredients: recipe.items,
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h1" color="initial">
        {isLoading ? (
          <span>
            Searching for <br/> recipes{loadingDots}
          </span>
        ) : searchPerformed && recipes.length !== 0 ? (
          <span>
            I got plenty of options for you...
          </span>
        ) : (
          <span>
            Error occurred.
          </span>
        )}
      </Typography>

      <Box sx={{mb: 1}}> 
        <SearchComponent
          placeholderText="Enter ingredients..."
          initialValue={initialQuery}
          onSearchSubmit={handleNewSearch}
        />
      </Box>

      {recipes.map((recipe, index) => (
        <RecipeItem
          id={index}
          key={index}
          title={recipe.title}
          descriptionItems={recipe.descriptionItems}
          items={recipe.items}
          procedure="" // Assuming these props are intentionally empty for now
          procedureSteps={[]} // Assuming these props are intentionally empty for now
          onClick={() => handleRecipeClick(recipe)}
        />
      ))}
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Box sx={{ textAlign: 'center', p: 4 }}> {/* MUI styling for fallback */}
        <Typography variant="h5">Loading search...</Typography>
      </Box>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
