"use client";

import { useState, useEffect } from "react";
import { useRecipeContext } from "@/components/recipe-context/recipe-context";
import TogetherAPI, { Recipe } from "@/utils/together-api/recipe-utils";
import styles from "./RecipePage.module.css";

export default function RecipePage() {
  const { selectedRecipe } = useRecipeContext();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const together = new TogetherAPI();

  useEffect(() => {
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

  // Placeholder search handler
  const handleSearch = (text: string) => {
    console.log(`Searching for: ${text}`);
    // Future functionality can be added here (e.g., modal, navigation)
  };

  if (!selectedRecipe) {
    return <p className="text">No recipe selected.</p>;
  }

  return (
    <div className="spacing-large">
      <h1 className="title1">{selectedRecipe.title}</h1>
      {loading && <p className="text">Loading recipe...</p>}
      {error && <p className="text">{error}</p>}
      {generatedRecipe ? (
        <div>
          <p className="text">{generatedRecipe.descriptionItems}</p>
          
          <h3 className="title3">Ingredients:</h3>
          <ul className={styles.ingredientsList}>
            {generatedRecipe.items.map((item, index) => (
              <li key={index} className={`${styles.listItem} text`}>
                {item}
                <img
                  src="/search.svg"
                  alt="Search this ingredient"
                  className={styles.searchIcon}
                  onClick={() => handleSearch(item)}
                />
              </li>
            ))}
          </ul>

          <h3 className="title3">Procedure:</h3>
          <p className="text">{generatedRecipe.procedure}</p>

          <h3 className="title3">Steps:</h3>
          <ol className={styles.stepsList}>
            {generatedRecipe.procedureSteps.map((step, index) => (
              <li key={index} className={`${styles.listItem} text`}>
                {step}
                <img
                  src="/search.svg"
                  alt="Search this step"
                  className={styles.searchIcon}
                  onClick={() => handleSearch(step)}
                />
              </li>
            ))}
          </ol>
        </div>
      ) : (
        !loading && !error && (
          <p className="text">No detailed recipe generated yet.</p>
        )
      )}
    </div>
  );
}