"use client";

import { useState, useEffect } from "react";
import { useRecipeContext } from "@/components/recipe-context/recipe-context";
import TogetherAPI, { Recipe } from "@/utils/together-api/recipe-utils";


export default function RecipePage() {
  const { selectedRecipe } = useRecipeContext();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const together = new TogetherAPI();

  useEffect(() => {
    // Only run this effect once when the component mounts
    if (!selectedRecipe) {
      setGeneratedRecipe(null);
      return;
    }

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const recipe = await together.generateRecipe(selectedRecipe);
        setGeneratedRecipe(recipe);
      } catch (err) {
        setError("Failed to generate recipe");
        console.error("Error generating recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (!selectedRecipe) {
    return <p>No recipe selected.</p>;
  }

  return (
    <div>
      <h1>{selectedRecipe.title}</h1>
      {loading && <p>Loading recipe...</p>}
      {error && <p>{error}</p>}
      {generatedRecipe ? (
        <div>
          <h2>{generatedRecipe.title}</h2>
          <p>{generatedRecipe.descriptionItems}</p>
          <h3>Ingredients:</h3>
          <ul>
            {generatedRecipe.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h3>Procedure:</h3>
          <p>{generatedRecipe.procedure}</p>
          <h3>Steps:</h3>
          <ol>
            {generatedRecipe.procedureSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      ) : (
        !loading && !error && <p>No detailed recipe generated yet.</p>
      )}
    </div>
  );
}