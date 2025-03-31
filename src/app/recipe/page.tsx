// app/recipe/page.tsx
"use client";

import { useRecipeContext } from "@/components/recipe-context/recipe-context";

export default function RecipePage() {
    const { selectedRecipe } = useRecipeContext();

    if (!selectedRecipe) {
        return <p>No recipe selected.</p>;
    }

    return (
        <div>
            <h1>{selectedRecipe.title}</h1>
            {/* Add more recipe details here */}
        </div>
    );
}