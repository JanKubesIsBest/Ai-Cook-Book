// components/RecipeItem.tsx
import React from 'react';
import styles from './RecipeItem.module.css';
import Link from 'next/link';

interface RecipeItemProps {
  title: string;
  description: string;
  ingredients: string[];
  isLastItem?: boolean; // Add optional prop to indicate if it's the last item
}

const RecipeItem: React.FC<RecipeItemProps> = ({ title, description, ingredients, isLastItem = false }) => {
  // Split ingredients roughly in half for two columns
  const midPoint = Math.ceil(ingredients.length / 2);
  const firstColumnIngredients = ingredients.slice(0, midPoint);
  const secondColumnIngredients = ingredients.slice(midPoint);

  return (
    <div className={`${styles.recipeItem} spacing-medium`}>
      <Link href={{
        pathname: "/recipe",
        query: {
          title: title,
          description: description,
          ingredients: JSON.stringify(ingredients),
          isLastItem: isLastItem
        }
      }}>

        <h3 className={`${styles.recipeTitle} title3`}>{title}</h3>
        <p className={`${styles.recipeDescription} text`}>{description}</p>
        <p className={`${styles.ingredientsTitle} text bold spacing-small`}>
          Crucial ingredients needed:
        </p>
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
        {!isLastItem && <hr className={styles.separator} />} {/* Conditionally render the separator */}
      </Link>
    </div>
  );
};

export default RecipeItem;