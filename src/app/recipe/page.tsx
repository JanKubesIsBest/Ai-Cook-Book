"use client";

import { useState, useEffect, useRef } from "react";
import { useRecipeContext } from "@/components/recipe-context/recipe-context";
import styles from "./RecipePage.module.css";
import AdditionalInfo from "@/components/addition-info/additional-info";
import SearchComponent from "@/components/search/search-component";
import { askAboutIngredient, generateRecipe, regenerateRecipe } from "@/utils/together-api/actions";
import { Recipe } from "../../utils/together-api/interfaces";

export default function RecipePage() {
  const { selectedRecipe } = useRecipeContext();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<{ [key: string]: string }>({});

  const hasFetchedRecipe = useRef(false);

  useEffect(() => {
    console.log("useEffect triggered in RecipePage");

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
        const recipe = await generateRecipe(selectedRecipe);
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
  }, []);

  const handleSearch = async (type: "ingredient" | "step", index: number, text: string) => {
    console.log(`handleSearch called for ${type} at index ${index}: "${text}"`);
    if (generatedRecipe != null) {
      try {
        const info = await askAboutIngredient(text, generatedRecipe)
        setAdditionalInfo((prev) => ({ ...prev, [`${type}-${index}`]: info ?? "" }));
      } catch (err) {
        console.error("Failed to fetch additional info:", err);
      }
    }
  };

  const handleDiscard = (key: string) => {
    console.log(`handleDiscard called for key: "${key}"`);
    setAdditionalInfo((prev) => {
      const newInfo = { ...prev };
      delete newInfo[key];
      return newInfo;
    });
  };

  const handleRecipeChange = async (changeRequest: string) => {
    console.log(`handleRecipeChange called with request: "${changeRequest}"`);
    if (!generatedRecipe) {
      console.log("No generated recipe to modify");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updatedRecipe = await regenerateRecipe(generatedRecipe, changeRequest);
      if (updatedRecipe) {
        setGeneratedRecipe(updatedRecipe);
        // Clear additional info since the recipe has changed
        setAdditionalInfo({});
      } else {
        setError("Failed to regenerate recipe");
      }
    } catch (err) {
      setError("Failed to regenerate recipe");
      console.error("Error regenerating recipe:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRecipe) {
    return <p className="text">No recipe selected.</p>;
  }

  return (
    <div className="spacing-large">
      <div className="spacing-medium">
        <h1 className="title1">{selectedRecipe.title}</h1>

        <div className={styles.regenerateSearchContainer}>
          <SearchComponent
            placeholderText="Make a change to the whole recipe..."
            onSearchSubmit={handleRecipeChange}
          />
        </div>
      </div>

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
                    <AdditionalInfo
                      info={additionalInfo[`ingredient-${index}`]}
                      recipe={generatedRecipe}
                      discard={() => handleDiscard(`ingredient-${index}`)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="title3">Procedure:</h3>
          <p className="text">{generatedRecipe.procedure}</p>

          <h3 className="title3">Steps:</h3>
          <div className="padding-small">
            <ol className={styles.stepsList}>
              {generatedRecipe.procedureSteps.map((step, index) => (
                <li key={index} className={styles.listItem}>
                  <div className={styles.stepWrapper}>
                    <div className={styles.itemContent}>
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
                    <AdditionalInfo
                      info={additionalInfo[`step-${index}`]}
                      recipe={generatedRecipe}
                      discard={() => handleDiscard(`step-${index}`)}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        !loading && !error && <p className="text">No detailed recipe generated yet.</p>
      )}
    </div>
  );
}