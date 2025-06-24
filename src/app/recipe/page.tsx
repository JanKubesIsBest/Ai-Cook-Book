"use client";

import { useState, useEffect, useRef } from "react";
import { useRecipeContext } from "@/components/recipe-context/recipe-context";
import AdditionalInfo from "@/components/addition-info/additional-info"; // Assuming this is MUI-compatible or handles its own styling
import SearchComponent from "@/components/search/search-component"; // Already refactored to MUI
import { askAboutIngredient, generateRecipe, regenerateRecipe } from "@/utils/together-api/actions";
import { Recipe } from "../../utils/together-api/interfaces";

// MUI Imports
import { Box, Typography, Container, List, ListItem, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AskAiButton from "@/components/custom-buttons/ask-ai-button/askAiButton";

export default function RecipePage() {
  const { selectedRecipe } = useRecipeContext();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<{ [key: string]: string }>({});

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
  }, [selectedRecipe]); // Added selectedRecipe to dependencies to re-fetch if it changes

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

  const handleRecipeChange = async (changeRequest: string) => {
    if (!generatedRecipe) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updatedRecipe = await regenerateRecipe(generatedRecipe, changeRequest);
      if (updatedRecipe) {
        setGeneratedRecipe(updatedRecipe);
        setAdditionalInfo({}); // Clear additional info since the recipe has changed
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
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1">No recipe selected.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}> {/* Main container with vertical padding */}
      <Box sx={{ mb: 4 }}> {/* Spacing below title and search */}
        <Typography variant="h3" component="h1" gutterBottom> {/* Title style and semantic tag */}
          {selectedRecipe.title}
        </Typography>

        <Box sx={{ mb: 2 }}> {/* Spacing below search component */}
          <SearchComponent
            placeholderText="Make a change to the whole recipe..."
            onSearchSubmit={handleRecipeChange}
          />
        </Box>
      </Box>

      {loading && (
        <Typography variant="body1" sx={{ textAlign: 'center', my: 2 }}>
          Loading recipe...
        </Typography>
      )}
      {error && (
        <Typography variant="body1" color="error" sx={{ textAlign: 'center', my: 2 }}>
          {error}
        </Typography>
      )}

      {generatedRecipe ? (
        <Box>
          <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}> {/* Use pre-line for newlines */}
            {generatedRecipe.descriptionItems}
          </Typography>

          <Typography variant="h4" component="h3" gutterBottom> {/* Title style and semantic tag */}
            Ingredients:
          </Typography>
          <Box sx={{ pl: 2, mb: 1 }}> {/* Padding-left for list bullets, margin-bottom */}
            <List disablePadding sx={{ listStyleType: 'disc' }}> {/* Enable disc bullets */}
              {generatedRecipe.items.map((item, index) => (
                <ListItem key={index} disableGutters sx={{ display: 'list-item', mb: 0 }}> {/* List item styling */}
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body1" sx={{ flexGrow: 1, mr: 1, whiteSpace: 'pre-line' }}>
                      <strong>{item}</strong>
                    </Typography>
                    <IconButton
                      aria-label="Search this ingredient"
                      onClick={() => handleSearch("ingredient", index, item)}
                      size="small"
                      sx={{ color: 'primary.main' }}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
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
          <Box sx={{ pl: 2, mb: 1 }}> {/* Padding-left for list numbers, margin-bottom */}
            <List disablePadding component="ol" sx={{ listStyleType: 'decimal' }}> {/* Enable decimal numbers */}
              {generatedRecipe.procedureSteps.map((step, index) => (
                <ListItem key={index} disableGutters sx={{ display: 'list-item', mb: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' }, // Stack on xs, row on sm and up
                      alignItems: { xs: 'flex-start', sm: 'center' }, // Align start on mobile, center on desktop
                      width: '100%',
                      gap: { xs: 1, sm: 1 }, // Gap between items
                    }}
                  >
                    <Typography variant="body1" sx={{ flexGrow: 1, mr: 1, whiteSpace: 'pre-line' }}>
                      {step}
                    </Typography>
                    <AskAiButton onClick={() => handleSearch("step", index, step)} buttonText="Ask Ai" />
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
