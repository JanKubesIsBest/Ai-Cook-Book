"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRecipeContext } from "@/components/recipe-context/recipe-context";
import AdditionalInfo from "@/components/addition-info/additional-info"; // Assuming this is MUI-compatible or handles its own styling
import CustomSearchTextField from "@/components/search/custom-textfield"; // Import the custom text field
// Removed: import SearchComponent from "@/components/search/search-component"; // No longer needed
import { askAboutIngredient, generateRecipe, regenerateRecipe } from "@/utils/together-api/actions";
import { Recipe } from "../../utils/together-api/interfaces";

// MUI Imports
import { Box, Typography, Container, List, ListItem, IconButton, CircularProgress } from '@mui/material';
// Removed: import SearchIcon from '@mui/icons-material/Search'; // Not directly used here anymore for the input
import AskAiButton from "@/components/custom-buttons/ask-ai-button/askAiButton";

export default function RecipePage() {
  const { selectedRecipe } = useRecipeContext();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<{ [key: string]: string }>({});
  // New state for the custom text field's input
  const [recipeChangeQuery, setRecipeChangeQuery] = useState<string>('');

  const hasFetchedRecipe = useRef(false);

  useEffect(() => {
    if (hasFetchedRecipe.current) {
      return;
    }

    if (!selectedRecipe) {
      setGeneratedRecipe(null);
      return;
    }

    const fetchRecipe = async () => {
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
  }, [selectedRecipe]);

  const handleSearch = async (type: "ingredient" | "step", index: number, text: string) => {
    if (generatedRecipe != null) {
      try {
        const info = await askAboutIngredient(text, generatedRecipe);
        setAdditionalInfo((prev) => ({ ...prev, [`${type}-${index}`]: info ?? "" }));
      } catch (err) {
        console.error("Failed to fetch additional info:", err);
      }
    }
  };

  const handleDiscard = (key: string) => {
    setAdditionalInfo((prev) => {
      const newInfo = { ...prev };
      delete newInfo[key];
      return newInfo;
    });
  };

  // Original handleRecipeChange now adapted to take the query directly
  const handleRecipeChange = useCallback(async (changeRequest: string) => {
    if (!generatedRecipe || !changeRequest.trim()) { // Ensure there's a request
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updatedRecipe = await regenerateRecipe(generatedRecipe, changeRequest);
      if (updatedRecipe) {
        setGeneratedRecipe(updatedRecipe);
        setAdditionalInfo({}); // Clear additional info since the recipe has changed
        setRecipeChangeQuery(''); // Clear the input field after successful submission
      } else {
        setError("Failed to regenerate recipe");
      }
    } catch (err) {
      setError("Failed to regenerate recipe");
      console.error("Error regenerating recipe:", err);
    } finally {
      setLoading(false);
    }
  }, [generatedRecipe]);

  // New function to trigger handleRecipeChange from CustomSearchTextField
  const handleRecipeChangeSubmit = () => {
    handleRecipeChange(recipeChangeQuery);
  };

  const handleRecipeChangeKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && recipeChangeQuery.trim() && !loading) {
      event.preventDefault();
      handleRecipeChangeSubmit();
    }
  };


  if (!selectedRecipe) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1">No recipe selected.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {selectedRecipe.title}
        </Typography>

        <Box sx={{ mb: 2 }}>
          {/* Replaced SearchComponent with CustomSearchTextField */}
          <CustomSearchTextField
            id="recipe-change-input"
            placeholderText="Make a change to the whole recipe..."
            value={recipeChangeQuery}
            onChange={(e) => setRecipeChangeQuery(e.target.value)}
            onKeyDown={handleRecipeChangeKeyDown}
            onSearchIconClick={handleRecipeChangeSubmit}
            isSearchIconDisabled={!recipeChangeQuery.trim() || loading} // Disable if empty or loading
            ariaLabel="recipe change input"
          />
        </Box>
      </Box>

      {loading && (
        <Container sx={{ textAlign: 'center', my: 4 }}> 
          <CircularProgress size={20} color="success" /> {/* Green loading spinner */}
          <Typography variant="body1" sx={{ textAlign: 'center', my: 2 }}>
            Loading recipe...
          </Typography>
        </Container>
      )}
      {error && (
        <Typography variant="body1" color="error" sx={{ textAlign: 'center', my: 2 }}>
          {error}
        </Typography>
      )
      }

      {generatedRecipe ? (
        <Box>
          <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
            {generatedRecipe.descriptionItems}
          </Typography>

          <Typography variant="h4" component="h3" gutterBottom>
            Ingredients:
          </Typography>
          <Box sx={{ pl: 2, mb: 1 }}>
            <List disablePadding sx={{ listStyleType: 'disc' }}>
              {generatedRecipe.items.map((item, index) => (
                <ListItem key={index} disableGutters sx={{ display: 'list-item', mb: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body1" sx={{ flexGrow: 1, mr: 1, whiteSpace: 'pre-line' }}>
                      <strong>{item}</strong>
                    </Typography>
                    <AskAiButton onClick={() => handleSearch("ingredient", index, item)} buttonText="Ask Ai"/>
                  </Box>
                  <AdditionalInfo
                    info={additionalInfo[`ingredient-${index}`]}
                    recipe={generatedRecipe}
                    discard={() => handleDiscard(`ingredient-${index}`)}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Typography variant="h4" component="h3" gutterBottom>
            Procedure:
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
            {generatedRecipe.procedure}
          </Typography>

          <Typography variant="h4" component="h3" gutterBottom>
            Steps:
          </Typography>
          <Box sx={{ pl: 2, mb: 1 }}>
            <List disablePadding component="ol" sx={{ listStyleType: 'decimal' }}>
              {generatedRecipe.procedureSteps.map((step, index) => (
                <ListItem key={index} disableGutters sx={{ display: 'list-item', mb: 0 }}>
                    <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      width: '100%',
                      gap: { xs: 1, sm: 1 },
                    }}
                  >
                    <Typography variant="body1" sx={{ flexGrow: 1, mr: 1, whiteSpace: 'pre-line' }}>
                      {step}
                    </Typography>
                    <AskAiButton onClick={() => handleSearch("step", index, step)} buttonText="Ask Ai"/>
                  </Box>
                  <AdditionalInfo
                    info={additionalInfo[`step-${index}`]}
                    recipe={generatedRecipe}
                    discard={() => handleDiscard(`step-${index}`)}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      ) : (
        !loading && !error && (
          <Typography variant="body1" sx={{ textAlign: 'center', my: 2 }}>
            No detailed recipe generated yet.
          </Typography>
        )
      )}
    </Container>
  );
}
