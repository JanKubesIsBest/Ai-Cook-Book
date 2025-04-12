import { stringify } from "querystring";
import Together from "together-ai";

export interface RecipeItemProps {
  title: string;
  description: string;
  ingredients: string[];
  isLastItem?: boolean;
}

export interface Recipe {
  id: number | null;
  title: string;
  descriptionItems: string;
  items: string[];
  procedure: string;
  procedureSteps: string[];
  isLastItem?: boolean;
  onClick?: () => void;
}

class TogetherAPI {
  private together: Together;

  constructor() {
    const key = process.env.NEXT_PUBLIC_TOGETHER_API_KEY;
    if (!key) {
      throw new Error("API key is required");
    }
    this.together = new Together({ apiKey: key });
  }

  private async _callAPI(prompt: string): Promise<string> {
    try {
      const completion = await this.together.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages: [{ role: "user", content: prompt }],
      });
      if (completion.choices[0].message?.content) {
        return completion.choices[0].message.content;
      }
      return "Error occurred!!";
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }

  async generateRecipe(recipeProps: RecipeItemProps): Promise<Recipe | null> {
    const prompt = `
      Generate a detailed recipe based on the following information:
      - Title: ${recipeProps.title}
      - Description: ${recipeProps.description}
      - Ingredients: ${recipeProps.ingredients.join(", ")}
  
      Respond with a JSON object containing the following fields:
      - "title": a string (the recipe title)
      - "description": a string (Description of the meal)
      - "descriptionItems": a string (a brief description of the recipe)
      - "items": an array of strings (the list of ingredients)
      - "procedure": a string (a summary of the cooking procedure)
      - "procedureSteps": an array of strings (step-by-step instructions for the recipe)

      Remember: THERE SHOULD NOT BE ANYTHING ELSE THAN THE JSON FILE. ONLY JSON. The text should start with { and end with }, so I can easily parse it to JSON. Don't start like this: JSON: . Start with this: {
    `;

    const content = await this._callAPI(prompt);

    try {
      const recipeData = JSON.parse(content);
      if (
        typeof recipeData.title === "string" &&
        typeof recipeData.descriptionItems === "string" &&
        Array.isArray(recipeData.items) &&
        recipeData.items.every((i: any) => typeof i === "string") &&
        typeof recipeData.procedure === "string" &&
        Array.isArray(recipeData.procedureSteps) &&
        recipeData.procedureSteps.every((s: any) => typeof s === "string")
      ) {
        return {
          id: null,
          title: recipeData.title,
          descriptionItems: recipeData.descriptionItems,
          items: recipeData.items,
          procedure: recipeData.procedure,
          procedureSteps: recipeData.procedureSteps,
        };
      } else {
        throw new Error("Invalid recipe format");
      }
    } catch (error) {
      console.error("Failed to parse recipe:", error);
      return null;
    }
  }

  async askAboutIngredient(ingredient: string, wholeRecipe: Recipe): Promise<string | null> {
    const prompt = `
      Given the following recipe, provide two concise sentences with useful information about "${ingredient}" based on its role in the recipe. The user has clicked a search icon next to this text and wants relevant details—focus on what might interest them, such as an ingredient's properties, substitutions, or preparation tips, or a step's purpose, technique, or common pitfalls, using the recipe context to tailor your response:
  
      - Title: ${wholeRecipe.title}
      - Description: ${wholeRecipe.descriptionItems}
      - Ingredients: ${wholeRecipe.items.join(", ")}
      - Procedure: ${wholeRecipe.procedure}
      - Steps: ${wholeRecipe.procedureSteps.join("; ")}
  
      Avoid mentioning whether you think "${ingredient}" is an ingredient or a step. Do not include any reasoning or extra text beyond the two sentences.

      Respond only with the two sentences, nothing else. Each sentence should be about 5 words, so 10 words TOTAL!
    `;

    const content = await this._callAPI(prompt);

    return content || null;
  }

  async searchRecipe(keyword: string): Promise<Recipe[] | null> {
    console.log("SEARCHING RECIPE !!!!");
    const prompt = `
      Search for recipes that include ${keyword}. Respond with a JSON object containing a "recipes" field, which is an array of recipe objects. Each recipe object should have the following fields:
      - "id": null (or a number if you can assign one)
      - "title": a string (the recipe title)
      - "descriptionItems": a string (a brief description of the recipe)
      - "items": an array of strings (the list of ingredients)
      - "procedure": a string (a summary of the cooking procedure)
      - "procedureSteps": an array of strings (step-by-step instructions for the recipe)
      
      Example response:
      {
        "recipes": [
          {
            "id": null,
            "title": "Example Recipe",
            "descriptionItems": "Description of the recipe....",
            "items": ["ingredient1", "ingredient2"],
            "procedure": "Cook everything together",
            "procedureSteps": ["Step 1: Do this", "Step 2: Do that"]
          }
        ]
      }

      The user should be amazed by your suggestions, but there as well should be an option
      for 
      1. the classic (something that user expects)
      - This means that you neccesarly don't want to add something that user has demanded. 
      - Ofcourse, somethings need to be made with something/in something, so then you might make a decision to make something with the thing user has demanded.
      2. something easy
      3-4: be creative
      
      NEVER EVER suggest user to make something from already made product. For example, when user demands chicken nuggets, he wants to make chicken nuggets in his kitchen. If user wants to make fish fingers, he does not want to buy them.

      Remember: THERE SHOULD NOT BE ANYTHING ELSE THAN THE JSON FILE. ONLY JSON. The text should start with { and end with }, so I can easily parse it to JSON. Don't start like this: JSON: . Start with this: {
    `;

    const content = await this._callAPI(prompt);

    try {
      const response = JSON.parse(content);
      if (
        Array.isArray(response.recipes) &&
        response.recipes.every(
          (r: any) =>
            (r.id === null || typeof r.id === "number") &&
            typeof r.title === "string" &&
            typeof r.descriptionItems === "string" &&
            Array.isArray(r.items) &&
            r.items.every((i: any) => typeof i === "string") &&
            typeof r.procedure === "string" &&
            Array.isArray(r.procedureSteps) &&
            r.procedureSteps.every((s: any) => typeof s === "string")
        )
      ) {
        return response.recipes as Recipe[];
      } else {
        throw new Error("Invalid recipes format");
      }
    } catch (error) {
      console.error("Failed to parse recipes:", error);
      return null;
    }
  }

  async askFollowUpQuestion(question: string, recipe: Recipe, previousResponse: string): Promise<string | null> {
    const prompt = `
      The user is asking a follow-up question about the recipe or the previous response. Here is the context:

      Recipe:
      - Title: ${recipe.title}
      - Description: ${recipe.descriptionItems}
      - Ingredients: ${recipe.items.join(", ")}
      - Procedure: ${recipe.procedure}
      - Steps: ${recipe.procedureSteps.join("; ")}

      Previous Response: "${previousResponse}"

      Follow-up Question: "${question}"

      Provide a concise and informative answer to the follow-up question, considering both the recipe and the previous response. Respond with no more than two sentences. The sentences should be max 8 words long and targeted on the question.
    `;

    const content = await this._callAPI(prompt);

    return content || null;
  }

  // New method to regenerate the recipe with a change
  async regenerateRecipe(originalRecipe: Recipe, changeRequest: string): Promise<Recipe | null> {
    const prompt = `
      You are given an existing recipe, and the user wants to make a change to it. Regenerate the recipe by applying the requested change while keeping the recipe as close as possible to the original. Here is the original recipe:

      - Title: ${originalRecipe.title}
      - Description: ${originalRecipe.descriptionItems}
      - Ingredients: ${originalRecipe.items.join(", ")}
      - Procedure: ${originalRecipe.procedure}
      - Steps: ${originalRecipe.procedureSteps.join("; ")}

      The user has requested the following change: "${changeRequest}"

      Regenerate the recipe with the requested change, ensuring it remains similar to the original recipe in style, structure, and intent, unless the change explicitly requires a significant deviation. Respond with a JSON object containing the following fields:
      - "title": a string (the recipe title, adjust if the change affects the title)
      - "descriptionItems": a string (a brief description of the recipe)
      - "items": an array of strings (the  list of ingredients)
      - "procedure": a string (a summary of the cooking procedure)
      - "procedureSteps": an array of strings (step-by-step instructions for the recipe)

      Example response:
      {
        "title": "Updated Recipe Title",
        "descriptionItems": "Updated description of the recipe....",
        "items": ["ingredient1", "ingredient2"],
        "procedure": "Updated cooking procedure",
        "procedureSteps": ["Step 1: Do this", "Step 2: Do that"]
      }

      IF SOMETHING CHANGES IN THE INGREDIENTS PART, YOU SHOULD ALSO REFINE THE STEPS -> those will change with the ingredients!

      Remember: THERE SHOULD NOT BE ANYTHING ELSE THAN THE JSON FILE. ONLY JSON. The text should start with { and end with }, so I can easily parse it to JSON. Don't start like this: JSON: . Start with this: {
    `;

    const content = await this._callAPI(prompt);

    try {
      const recipeData = JSON.parse(content);
      if (
        typeof recipeData.title === "string" &&
        typeof recipeData.descriptionItems === "string" &&
        Array.isArray(recipeData.items) &&
        recipeData.items.every((i: any) => typeof i === "string") &&
        typeof recipeData.procedure === "string" &&
        Array.isArray(recipeData.procedureSteps) &&
        recipeData.procedureSteps.every((s: any) => typeof s === "string")
      ) {
        return {
          id: null,
          title: recipeData.title,
          descriptionItems: recipeData.descriptionItems,
          items: recipeData.items,
          procedure: recipeData.procedure,
          procedureSteps: recipeData.procedureSteps,
        };
      } else {
        throw new Error("Invalid recipe format");
      }
    } catch (error) {
      console.error("Failed to parse regenerated recipe:", error);
      return null;
    }
  }
}

export default TogetherAPI;