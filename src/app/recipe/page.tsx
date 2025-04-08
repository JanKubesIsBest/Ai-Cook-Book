"use client";

import { useState, useEffect, useRef } from "react";
import { useRecipeContext } from "@/components/recipe-context/recipe-context";
import TogetherAPI, { Recipe } from "@/utils/together-api/recipe-utils";
import styles from "./RecipePage.module.css";
import AdditionalInfo from "@/components/addition-info/additional-info";

export default function RecipePage() {
  const { selectedRecipe } = useRecipeContext();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<{ [key: string]: string }>({});

  // Use a ref to track if the initial fetch has been performed
  const hasFetchedRecipe = useRef(false);

  const together = new TogetherAPI();

  useEffect(() => {
    console.log("useEffect triggered in RecipePage");

    // Prevent duplicate calls in Strict Mode
    if (hasFetchedRecipe.current) {
      console.log("Initial fetch already performed, skipping");
      return;
    }

    if (!selectedRecipe) {
      console.log("No selected recipe, resetting state");
      setGeneratedRecipe(null);
      return;
    }

    const fetchRecipe = async () => {
      console.log(`fetchRecipe called for recipe: "${selectedRecipe.title}"`);
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

    hasFetchedRecipe.current = true;
    fetchRecipe();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSearch = async (type: "ingredient" | "step", index: number, text: string) => {
    console.log(`handleSearch called for ${type} at index ${index}: "${text}"`);
    if (generatedRecipe != null) {
      try {
        const info = await together.askAboutIngredient(text, generatedRecipe);
        setAdditionalInfo((prev) => ({ ...prev, [`${type}-${index}`]: info ?? "" }));
      } catch (err) {
        console.error("Failed to fetch additional info:", err);
      }
    }
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
          <div className="padding-small">
            <ul className={styles.ingredientsList}>
              {generatedRecipe.items.map((item, index) => (
                <li key={index} className={styles.listItem}>
                  <div className={styles.itemWrapper}>
                    <div className={styles.itemContent}>
                      <p className="text">{item}</p>
                      <img
                        src="/search.svg"
                        alt="Search this ingredient"
                        className={styles.searchIcon}
                        onClick={() => handleSearch("ingredient", index, item)}
                      />
                    </div>
                    <AdditionalInfo info={additionalInfo[`ingredient-${index}`]} recipe={generatedRecipe} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="title3">Procedure:</h3>
          <p className="text">{generatedRecipe.procedure}</p>

          <h3 className="title3">Steps:</h3>
          <ol className={styles.stepsList}>
            {generatedRecipe.procedureSteps.map((step, index) => (
              <li key={index} className={styles.listItem}>
                <div className={styles.stepWrapper}>
                  <div className={styles.stepContent}>
                    <p className="text">
                      {step}
                      <img
                        src="/search.svg"
                        alt="Search this step"
                        className={styles.searchIcon}
                        onClick={() => handleSearch("step", index, step)}
                      />
                    </p>
                  </div>
                  <AdditionalInfo info={additionalInfo[`step-${index}`]} recipe={generatedRecipe} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        !loading && !error && <p className="text">No detailed recipe generated yet.</p>
      )}
    </div>
  );
}