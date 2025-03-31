// components/RecipeItem.tsx
"use client";

import React from 'react';
import styles from './RecipeItem.module.css';
import { useRouter } from 'next/navigation';
import { useRecipeContext } from '../recipe-context/recipe-context';

interface RecipeItemProps {
  title: string;
  description: string;
  ingredients: string[];
  isLastItem?: boolean;
}

const RecipeItem: React.FC<RecipeItemProps> = ({ title, description, ingredients, isLastItem = false }) => {
  const router = useRouter();
  const { setSelectedRecipe } = useRecipeContext();

  const midPoint = Math.ceil(ingredients.length / 2);
  const firstColumnIngredients = ingredients.slice(0, midPoint);
  const secondColumnIngredients = ingredients.slice(midPoint);

  const handleRecipeClick = () => {
    console.log("Pushing to recipe");
    const thisRecipeItem: RecipeItemProps = {
      title: title,
      description: description,
      ingredients: ingredients,
    };
    console.log("Before setSelectedRecipe:", thisRecipeItem);
    setSelectedRecipe({ ...thisRecipeItem }); // Create a new object
    console.log("After setSelectedRecipe:", thisRecipeItem);
    console.log("Router before push:", router);
    router.push('/recipe');
  };

  return (
    <div
      className={`${styles.recipeItem} spacing-medium`}
      onClick={handleRecipeClick} // Corrected onClick handler
      style={{ cursor: 'pointer' }}
    >
      <h3 className={`${styles.recipeTitle} title3`}>{title}</h3>
      <p className={`${styles.recipeDescription} text`}>{description}</p>
      <p className={`${styles.ingredientsTitle} text bold spacing-small`}>Crucial ingredients needed:</p>
      <div className={styles.ingredientsGrid}>
        <ul className={styles.ingredientsList}>
          {firstColumnIngredients.map((ingredient, index) => (
            <li key={`col1-${index}`} className="text">{ingredient}</li>
          ))}
        </ul>
        <ul className={styles.ingredientsList}>
          {secondColumnIngredients.map((ingredient, index) => (
            <li key={`col2-${index}`} className="text">{ingredient}</li>
          ))}
        </ul>
      </div>
      {!isLastItem && <hr className={styles.separator} />}
    </div>
  );
};

export default RecipeItem;