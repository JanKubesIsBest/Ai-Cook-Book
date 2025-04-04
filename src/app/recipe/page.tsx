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
  // State to store additional information for each item
  const [additionalInfo, setAdditionalInfo] = useState<{ [key: string]: string }>({});

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

  // Updated search handler to fetch and display additional info
  const handleSearch = async (type: "ingredient" | "step", index: number, text: string) => {
    if (generatedRecipe != null) {
      try {
        const info = await together.askAboutIngredient(text, generatedRecipe);
        setAdditionalInfo((prev) => ({ ...prev, [`${type}-${index}`]: info ?? '' }));
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
          <ul className={styles.ingredientsList}>
            {generatedRecipe.items.map((item, index) => (
              <li key={index} className={styles.listItem}>
                <div className={styles.itemWrapper}>
                  <div className={styles.itemContent}>
                    <span className="text">{item}</span>
                    <img
                      src="/search.svg"
                      alt="Search this ingredient"
                      className={styles.searchIcon}
                      onClick={() => handleSearch("ingredient", index, item)}
                    />
                  </div>
                  <div
                    className={`${styles.additionalInfo} ${
                      additionalInfo[`ingredient-${index}`] ? styles.show : ""
                    }`}
                  >
                    {additionalInfo[`ingredient-${index}`]}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="title3">Procedure:</h3>
          <p className="text">{generatedRecipe.procedure}</p>

          <h3 className="title3">Steps:</h3>
          <ol className={styles.stepsList}>
            {generatedRecipe.procedureSteps.map((step, index) => (
              <li key={index} className={styles.listItem}>
                <div className={styles.stepWrapper}>
                  <div className={styles.stepContent}>
                    {step}
                    <img
                      src="/search.svg"
                      alt="Search this step"
                      className={styles.searchIcon}
                      onClick={() => handleSearch("step", index, step)}
                    />
                  </div>
                  <div
                    className={`${styles.additionalInfo} ${
                      additionalInfo[`step-${index}`] ? styles.show : ""
                    }`}
                  >
                    {additionalInfo[`step-${index}`]}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        !loading &&
        !error && <p className="text">No detailed recipe generated yet.</p>
      )}
    </div>
  );
}