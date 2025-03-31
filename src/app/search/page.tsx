// app/search/page.tsx
"use client";

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation'; // Hook to read URL query params
import SearchComponent from '@/components/search/search-component';
import RecipeItem from '@/components/recipe-item/recipe-item';
import styles from './page.module.css'; // Using a similar CSS module
import { RecipeProvider } from '@/components/recipe-context/recipe-context';

// Define the structure of a recipe object (same as before)
interface Recipe {
    id: number;
    title: string;
    description: string;
    ingredients: string[];
}

// --- Mock Search Function (same as before) ---
const mockSearchItems = (query: string): Promise<Recipe[]> => {
    console.log(`Simulating search for: ${query}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            const results: Recipe[] = [
                { id: 1, title: "Seasoned ground beef with tomato salad...", description: "Seasoned ground beef, which will make your day...", ingredients: ["Ground beef", "Tomatoes", "Salad", "Oil", "Pepper", "Salt"] },
                { id: 2, title: "Simple Chicken Stir-fry...", description: "A quick and easy chicken stir-fry...", ingredients: ["Chicken Breast", "Broccoli", "Bell Pepper", "Soy Sauce", "Ginger", "Garlic"] },
                { id: 3, title: "Vegetarian Pasta Primavera...", description: "A light and flavorful pasta dish...", ingredients: ["Pasta", "Asparagus", "Peas", "Zucchini", "Cherry Tomatoes", "Parmesan"] }
            ];
            resolve(results);
        }, 2500);
    });
};
// --- End Mock Search Function ---


// Component to handle the actual logic, wrapped in Suspense
function SearchPageContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || ''; // Get query 'q' from URL

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingDots, setLoadingDots] = useState<string>('');
    const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
    const [currentDisplayQuery, setCurrentDisplayQuery] = useState<string>(initialQuery);

    // Function to perform search and update state
    // useCallback ensures this function has a stable identity across renders
    // unless its dependencies change (which they don't here)
    const performSearch = useCallback(async (query: string) => {
        if (!query) {
            setRecipes([]);
            setSearchPerformed(true); // Mark search as done (even if query is empty)
            setIsLoading(false);
            return;
        }
        setSearchPerformed(true);
        setIsLoading(true);
        setRecipes([]); // Clear previous results immediately
        setCurrentDisplayQuery(query); // Update the title/query display if needed

        try {
            const results = await mockSearchItems(query);
            setRecipes(results);
        } catch (error) {
            console.error("Search failed:", error);
            setRecipes([]);
        } finally {
            setIsLoading(false);
        }
    }, []); // No dependencies, function is stable

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
    }, [initialQuery, performSearch]); // Rerun if the initial query from URL changes

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
                    description={recipe.description}
                    ingredients={recipe.ingredients}
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