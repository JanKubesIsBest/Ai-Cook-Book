// app/search/page.tsx
"use client";

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation'; // Hook to read URL query params
import SearchComponent from '@/components/search/search-component';
import RecipeItem from '@/components/recipe-item/recipe-item';
import styles from './page.module.css'; // Using a similar CSS module
import { RecipeProvider } from '@/components/recipe-context/recipe-context';
import TogetherAPI, { Recipe } from '@/utils/together-api/recipe-utils';

// Component to handle the actual logic, wrapped in Suspense
function SearchPageContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || ''; // Get query 'q' from URL

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingDots, setLoadingDots] = useState<string>('');
    const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
    const [currentDisplayQuery, setCurrentDisplayQuery] = useState<string>(initialQuery);

    const together = new TogetherAPI();

    // Function to perform search and update state
    // useCallback ensures this function has a stable identity across renders
    // unless its dependencies change (which they don't here)
    const performSearch = useCallback(async (query: string) => {
        console.log(query);

        if (!query) {
            setRecipes([]);
            setSearchPerformed(true);
            setIsLoading(false);
            return;
        }

        setSearchPerformed(true);
        setIsLoading(true);
        setRecipes([]);
        setCurrentDisplayQuery(query);

        try {
            const fetchedRecipes = await together.searchRecipe(query);
            console.log(fetchedRecipes);
            const recipesToSet: Recipe[] = fetchedRecipes || [];
            setRecipes(recipesToSet);
        } catch (error) {
            console.error("Search failed:", error);
            setRecipes([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effect to run the initial search when the page loads or initialQuery changes
    useEffect(() => {
        if (initialQuery) {
            // We need to make sure we don't immediately flash the loading state
            // if the data is already there (e.g., navigating back)
            // For this example, we'll just run the search on load / query change
            performSearch(initialQuery);
        } else {
            // Handle case where there's no initial query in the URL
            setSearchPerformed(false); // Reset if navigated here without a query
            setRecipes([]);
        }
    }, [initialQuery]); // Rerun if the initial query from URL changes

    // Effect for the loading dots animation (same as before)
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;
        if (isLoading) {
            intervalId = setInterval(() => {
                setLoadingDots((dots) => (dots.length >= 3 ? '' : dots + '.'));
            }, 400);
        } else {
            setLoadingDots('');
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isLoading]);

    // Handler for searches initiated *from this page's* SearchComponent
    const handleNewSearch = (newQuery: string) => {
        // Update the input display immediately (optional, SearchComponent handles its own state)
        // setCurrentDisplayQuery(newQuery);
        performSearch(newQuery);
        // Optional: Update URL without full page reload
        // router.push(`/search?q=${encodeURIComponent(newQuery)}`);
    };

    return (
        <main className={``}>


            <div className='not-bold title1 text-start spacing-large italic'>
                {isLoading ? (
                    <h1 className={`${styles.loadingText}`}>
                        Searching for recipes{loadingDots}
                    </h1>
                ) : searchPerformed && recipes.length != 0 ? ( // Check if a search has been attempted
                    <h1 className="">
                        I got plenty of options for you...
                    </h1>
                ) : (
                    <h1 className="">
                        Error occured.
                    </h1>
                )
                }
            </div>

            <div className="spacing-large">
                <SearchComponent
                    placeholderText="Enter ingredients..."
                    // Pass the initial query from URL to prefill the input
                    initialValue={initialQuery}
                    // Handle new searches initiated on this page
                    onSearchSubmit={handleNewSearch}
                />
            </div>
            {recipes.map((recipe, index) => (
                <RecipeItem
                    key={recipe.id}
                    title={recipe.title}
                    description={recipe.descriptionItems} // Note: should be description based on Recipe interface
                    ingredients={recipe.items} // Note: should be ingredients based on Recipe interface
                    isLastItem={index === recipes.length - 1}
                />
            ))}

        </main>
    );
}


// We need to wrap the component using useSearchParams in Suspense
// as recommended by Next.js documentation.
export default function SearchPage() {
    return (
        <Suspense fallback={<div className="title2 text-center padding-large">Loading search...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}