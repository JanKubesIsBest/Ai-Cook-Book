import { stringify } from 'querystring';
import Together from 'together-ai';

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
}

class TogetherAPI {
  private together: Together;


  constructor() {
    const key = process.env.TOGETHER_API_KEY;
    if (!key) {
      throw new Error('API key is required');
    }
    this.together = new Together({ apiKey: key });
  }

  private async _callAPI(prompt: string): Promise<string> {
    try {
      const completion = await this.together.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages: [{ role: 'user', content: prompt }],
      });
      if (completion.choices[0].message?.content) {
        return completion.choices[0].message.content;
      }

      console.log("Response empty: " + completion.choices[0].message?.content)
      return "Error occured!!"
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  async generateRecipe(recipeProps: RecipeItemProps): Promise<Recipe | null> {
    // Construct a detailed prompt using the RecipeItemProps
    const prompt = `
      Generate a detailed recipe based on the following information:
      - Title: ${recipeProps.title}
      - Description: ${recipeProps.description}
      - Ingredients: ${recipeProps.ingredients.join(', ')}
  
      Respond with a JSON object containing the following fields:
      - "title": a string (the recipe title)
      - "description": a string (Description of the meal)
      - "descriptionItems": a string (a brief description of the recipe)
      - "items": an array of strings (the list of ingredients)
      - "procedure": a string (a summary of the cooking procedure)
      - "procedureSteps": an array of strings (step-by-step instructions for the recipe)

      Remember: THERE SHOULD NOT BE ANYTHING ELSE THAN THE JSON FILE. ONLY JSON. The text should start with { and end with }, so I can easily parse it to JSON. Don't start like this: JSON: . Start with this: {
    `;
  
    // Call the Together API with the prompt
    const content = await this._callAPI(prompt);
  
    try {
      console.log("JSON: " + content)      
      // Parse the API response as JSON
      const recipeData = JSON.parse(content);

  
      // Validate the response format against the Recipe interface
      if (
        typeof recipeData.title === 'string' &&
        typeof recipeData.descriptionItems === 'string' &&
        Array.isArray(recipeData.items) &&
        recipeData.items.every((i: any) => typeof i === 'string') &&
        typeof recipeData.procedure === 'string' &&
        Array.isArray(recipeData.procedureSteps) &&
        recipeData.procedureSteps.every((s: any) => typeof s === 'string')
      ) {
        // Return the parsed data as a Recipe object
        return {
          id: null,
          title: recipeData.title,
          descriptionItems: recipeData.descriptionItems,
          items: recipeData.items,
          procedure: recipeData.procedure,
          procedureSteps: recipeData.procedureSteps,
        };
      } else {
        throw new Error('Invalid recipe format');
      }
    } catch (error) {
      console.error('Failed to parse recipe:', error);
      return null;
    }
  }

  async askAboutIngredient(ingredient: string, wholeRecipe: Recipe): Promise<string | null> {
    const prompt = `Provide information about this ingrediant or step (I don't know if it is ingredient or step, you have to guess): ${ingredient}.
    
    This is the whole recipe so you can create more educated guess and answer with more tailored response: 

    title: ${wholeRecipe.title}
    Description of items: ${wholeRecipe.descriptionItems}
    Procedure: ${wholeRecipe.procedure}
    Steps: ${wholeRecipe.procedureSteps}

    Respond with 2 sentences regarding the ingredient or step. Don't answer if you think it's step or ingredient. Answer for the user. Think about what user wants to know (if it is a step, he might want to know furter details. If it is an ingredient, he might want to learn more about it.)
    `;

    console.log("Prompt: " + prompt)


    const content = await this._callAPI(prompt);
    
    console.log("Answer: " + content)

    return ""
  }

  async searchRecipe(keyword: string): Promise<Recipe[] | null> {
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
      2. something easy
      3-4: be creative
      
      Remember: THERE SHOULD NOT BE ANYTHING ELSE THAN THE JSON FILE. ONLY JSON. The text should start with { and end with }, so I can easily parse it to JSON. Don't start like this: JSON: . Start with this: {
    `;
  
    const content = await this._callAPI(prompt);
    
    try {
      console.log("Raw API response:", content); // Debug the raw response
      const response = JSON.parse(content);
  
      // Validate that the response has a "recipes" array and matches the Recipe interface
      if (
        Array.isArray(response.recipes) &&
        response.recipes.every(
          (r: any) =>
            (r.id === null || typeof r.id === 'number') &&
            typeof r.title === 'string' &&
            typeof r.descriptionItems === 'string' &&
            Array.isArray(r.items) &&
            r.items.every((i: any) => typeof i === 'string') &&
            typeof r.procedure === 'string' &&
            Array.isArray(r.procedureSteps) &&
            r.procedureSteps.every((s: any) => typeof s === 'string')
        )
      ) {
        // Directly return the validated recipes as they match the Recipe interface
        return response.recipes as Recipe[];
      } else {
        throw new Error('Invalid recipes format');
      }
    } catch (error) {
      console.error('Failed to parse recipes:', error);
      return null;
    }
  }
}

export default TogetherAPI;