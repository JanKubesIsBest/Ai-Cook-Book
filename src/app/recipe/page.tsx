"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RecipeItemProps {
  title: string;
  description: string;
  ingredients: string[];
  isLastItem?: boolean; // Add optional prop to indicate if it's the last item
}

export default function RecipeDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeItemProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const title = searchParams.get('title');
    const description = searchParams.get('description');
    const ingredientsString = searchParams.get('ingredients');
    const isLastItemString = searchParams.get('isLastItem');

    if (!title || !description || !ingredientsString) {
      setError('Missing required parameters.');
      setLoading(false);
      return;
    }

    try {
      const ingredients = JSON.parse(ingredientsString) as string[];
      const isLastItem = isLastItemString === 'true';

      setRecipe({
        title,
        description,
        ingredients,
        isLastItem,
      });
      setLoading(false);
    } catch (parseError) {
      setError('Invalid ingredients format.');
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <h2>Ingredients:</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      {recipe.isLastItem && <p>This is the last recipe.</p>}
      <button onClick={() => router.back()}>Back</button>
    </div>
  );
}