"use client";

import React, { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import SearchComponent from "@/components/search/search-component";
import RecipeItem from "@/components/recipe-item/recipe-item";
import styles from "./page.module.css";
import { useRecipeContext } from "@/components/recipe-context/recipe-context";
import TogetherAPI, { Recipe } from "@/utils/together-api/recipe-utils";

function SearchPageContent() {
  const { searchResults, setSearchResults, setSelectedRecipe } = useRecipeContext();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingDots, setLoadingDots] = useState<string>("");
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [currentDisplayQuery, setCurrentDisplayQuery] = useState<string>(initialQuery);

  // Use a ref to track if the initial search has been performed
  const hasPerformedInitialSearch = useRef(false);

  const together = new TogetherAPI();

  const performSearch = useCallback(
    async (query: string) => {
      console.log(`performSearch called with query: "${query}"`);

      if (!query) {
        console.log("Query is empty, resetting state");
        setRecipes([]);
        setSearchPerformed(true);
        setIsLoading(false);
        setCurrentDisplayQuery("");
        return;
      }

      // If the query differs from the current display query, force a new search
      console.log("Old query:", currentDisplayQuery);
      console.log("New query:", query);
      const differentQuery = query !== currentDisplayQuery;
      console.log("Different query?:", differentQuery);

      // Check if results are already cached and the query hasn't changed
      if (!differentQuery && searchResults[query] !== undefined) {
        console.log(`Using cached results for query: "${query}"`);
        setRecipes(searchResults[query] || []);
        setSearchPerformed(true);
        setIsLoading(false);
        setCurrentDisplayQuery(query);
        return;
      }

      // Perform a new search if the query is different or not cached
      console.log(`Performing new search for query: "${query}"`);
      setSearchPerformed(true);
      setIsLoading(true);
      setRecipes([]);
      setCurrentDisplayQuery(query);

      try {
        const fetchedRecipes = await together.searchRecipe(query);
        const recipesToSet: Recipe[] = fetchedRecipes || [];
        console.log(`Fetched ${recipesToSet.length} recipes for query: "${query}"`);
        setRecipes(recipesToSet);
        setSearchResults(query, recipesToSet); // Cache the results
      } catch (error) {
        console.error("Search failed:", error);
        setRecipes([]);
        setSearchResults(query, []); // Cache empty results on error
      } finally {
        setIsLoading(false);
      }
    },
    [searchResults, setSearchResults] // Removed currentDisplayQuery from dependencies
  );

  useEffect(() => {
    console.log(`useEffect triggered with initialQuery: "${initialQuery}"`);

    // Prevent duplicate calls in Strict Mode
    if (hasPerformedInitialSearch.current) {
      console.log("Initial search already performed, skipping");
      return;
    }

    if (initialQuery) {
      console.log(`Performing initial search for query: "${initialQuery}"`);
      hasPerformedInitialSearch.current = true;
      performSearch(initialQuery);
    } else {
      console.log("No initial query, resetting state");
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
    console.log(`handleNewSearch called with newQuery: "${newQuery}"`);
    performSearch(newQuery);
    // Optional: Update URL without full page reload
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(newQuery)}`);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    console.log(`handleRecipeClick called for recipe: "${recipe.title}"`);
    setSelectedRecipe({
      title: recipe.title,
      description: recipe.descriptionItems,
      ingredients: recipe.items,
    });
  };

  return (
    <main>
      <div className="not-bold title1 text-start spacing-large italic">
        {isLoading ? (
          <h1 className={styles.loadingText}>
            Searching for recipes{loadingDots}
          </h1>
        ) : searchPerformed && recipes.length !== 0 ? (
          <h1>I got plenty of options for you...</h1>
        ) : (
          <h1>Error occurred.</h1>
        )}
      </div>

      <div className="spacing-large">
        <SearchComponent
          placeholderText="Enter ingredients..."
          initialValue={initialQuery}
          onSearchSubmit={handleNewSearch}
        />
      </div>

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
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="title2 text-center padding-large">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}