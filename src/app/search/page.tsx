"use client";

import React, { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import SearchComponent from "@/components/search/search-component";
import RecipeItem from "@/components/recipe-item/recipe-item";
import { useRecipeContext } from "@/components/recipe-context/recipe-context";
import { searchRecipe } from "@/utils/together-api/actions";
import { Recipe } from "../../utils/together-api/interfaces";

// MUI Imports
import { Box, Typography, Container } from '@mui/material';

function SearchPageContent() {
  const { searchResults, setSearchResults, setSelectedRecipe } = useRecipeContext();
  const searchParams = useSearchParams();

  // Retrieve initial query and styles from URL
  const initialQuery = searchParams.get("q") || "";
  const initialStylesParam = searchParams.get("styles");
  const initialStyles = initialStylesParam ? initialStylesParam.split(',') : [];

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingDots, setLoadingDots] = useState<string>("");
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [currentDisplayQuery, setCurrentDisplayQuery] = useState<string>(initialQuery);
  // Keep track of current styles for display purposes and to prevent re-search
  const [currentDisplayStyles, setCurrentDisplayStyles] = useState<string[]>(initialStyles);

  const hasPerformedInitialSearch = useRef(false);

  // performSearch - NOW ACCEPTS STYLES
  const performSearch = useCallback(
    async (query: string, styles: string[] = []) => { // Default styles to empty array
      const combinedQuery = styles.length > 0
        ? `${query} styles:${styles.join(',')}` // Format: "query styles:style1,style2"
        : query;

      if (!combinedQuery) { // Check for empty combined query
        setRecipes([]);
        setSearchPerformed(true);
        setIsLoading(false);
        setCurrentDisplayQuery("");
        setCurrentDisplayStyles([]); // Reset styles on empty search
        return;
      }

      // Determine if a new search is needed based on query AND styles
      const differentQuery = query !== currentDisplayQuery;
      const differentStyles = JSON.stringify(styles.sort()) !== JSON.stringify(currentDisplayStyles.sort());

      if (!differentQuery && !differentStyles && searchResults[combinedQuery] !== undefined) {
        setRecipes(searchResults[combinedQuery] || []);
        setSearchPerformed(true);
        setIsLoading(false);
        setCurrentDisplayQuery(query);
        setCurrentDisplayStyles(styles);
        return;
      }

      setSearchPerformed(true);
      setIsLoading(true);
      setRecipes([]);
      setCurrentDisplayQuery(query);
      setCurrentDisplayStyles(styles); // Set the styles being searched for

      try {
        // Pass the formatted query to searchRecipe
        const fetchedRecipes = await searchRecipe(combinedQuery);
        const recipesToSet: Recipe[] = fetchedRecipes || [];
        setRecipes(recipesToSet);
        setSearchResults(combinedQuery, recipesToSet); // Store results with combined query
      } catch (error) {
        console.error("Search failed:", error);
        setRecipes([]);
        setSearchResults(combinedQuery, []); // Store empty results for combined query
      } finally {
        setIsLoading(false);
      }
    },
    [searchResults, setSearchResults, currentDisplayQuery, currentDisplayStyles]
  );

  // useEffect - UPDATED to retrieve initial styles and pass them
  useEffect(() => {
    // Check if initial search has already been performed to prevent re-running on subsequent renders
    // that don't involve a true URL change.
    if (hasPerformedInitialSearch.current) {
      return;
    }

    if (initialQuery || initialStyles.length > 0) { // Trigger initial search if query or styles exist
      hasPerformedInitialSearch.current = true;
      performSearch(initialQuery, initialStyles);
    } else {
      setSearchPerformed(false);
      setRecipes([]);
      setCurrentDisplayQuery("");
      setCurrentDisplayStyles([]); // Ensure styles are reset if no initial params
    }
  }, [initialQuery, initialStyles, performSearch]); // Dependencies include initialStyles

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

  // handleNewSearch - NOW ACCEPTS STYLES AND UPDATES URL
  const handleNewSearch = (newQuery: string, newStyles: string[]) => {
    performSearch(newQuery, newStyles);

    const encodedQuery = encodeURIComponent(newQuery);
    const encodedStyles = newStyles.length > 0
      ? `&styles=${encodeURIComponent(newStyles.join(','))}`
      : '';
    window.history.pushState({}, '', `/search?q=${encodedQuery}${encodedStyles}`);
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
          initialSelectedStyles={initialStyles} // Pass retrieved styles to SearchComponent
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
          procedure=""
          procedureSteps={[]}
          onClick={() => handleRecipeClick(recipe)}
        />
      ))}
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h5">Loading search...</Typography>
      </Box>
    }>
      <SearchPageContent />
    </Suspense>
  );
}