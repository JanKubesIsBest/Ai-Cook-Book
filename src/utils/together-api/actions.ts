'use server'; // Ensure this file runs on the server

import TogetherAPI from './recipe-utils'; // Adjust the import path to your TogetherAPI class
import { Recipe, RecipeItemProps } from './interfaces';

// Initialize the API once
const api = new TogetherAPI();

// Server Action for generating a recipe
export async function generateRecipe(recipeProps: RecipeItemProps): Promise<Recipe | null> {
  return await api.generateRecipe(recipeProps);
}

// Server Action for asking about an ingredient
export async function askAboutIngredient(ingredient: string, wholeRecipe: Recipe): Promise<string | null> {
  return await api.askAboutIngredient(ingredient, wholeRecipe);
}

// Server Action for searching recipes
export async function searchRecipe(keyword: string): Promise<Recipe[] | null> {
  return await api.searchRecipe(keyword);
}

// Server Action for asking a follow-up question
export async function askFollowUpQuestion(question: string, recipe: Recipe, previousResponse: string): Promise<string | null> {
  return await api.askFollowUpQuestion(question, recipe, previousResponse);
}

// Server Action for regenerating a recipe
export async function regenerateRecipe(originalRecipe: Recipe, changeRequest: string): Promise<Recipe | null> {
  return await api.regenerateRecipe(originalRecipe, changeRequest);
}