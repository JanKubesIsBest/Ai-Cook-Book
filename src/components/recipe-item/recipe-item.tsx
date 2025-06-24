"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useRecipeContext } from '../recipe-context/recipe-context';
import { Recipe } from "../../utils/together-api/interfaces";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  CardActionArea
} from '@mui/material';

interface SelectedRecipePayload {
  title: string;
  description: string;
  ingredients: string[];
}

const RecipeItem: React.FC<Recipe> = ({ title, descriptionItems, items, isLastItem = false }) => {
  const router = useRouter();
  const { setSelectedRecipe } = useRecipeContext();

  const midPoint = Math.ceil(items.length / 2);
  const firstColumnIngredients = items.slice(0, midPoint);
  const secondColumnIngredients = items.slice(midPoint);

  const handleRecipeClick = () => {
    const selectedRecipePayload: SelectedRecipePayload = {
      title: title,
      description: descriptionItems,
      ingredients: items,
    };
    setSelectedRecipe(selectedRecipePayload);
    router.push('/recipe');
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: 3,
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={handleRecipeClick} sx={{ cursor: 'pointer' }}>
        <CardContent>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 1,
            }}
          >
            {descriptionItems}
          </Typography>

          <Typography
            variant="subtitle1"
            component="p"
            sx={{
              fontWeight: 'bold',
              mb: 0,
            }}
          >
            Crucial ingredients needed:
          </Typography>

          <Grid container spacing={0}>
            <Grid>
              <List dense disablePadding sx={{listStyleType: 'disc', pl: 2 }}>
                {firstColumnIngredients.map((ingredient, index) => (
                  <ListItem key={`col1-${index}`} sx={{ display: 'list-item' }}>
                    <Typography variant="body2">{ingredient}</Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid>
              <List dense disablePadding sx={{listStyleType: 'disc', pl: 2 }}>
                {secondColumnIngredients.map((ingredient, index) => (
                  <ListItem key={`col1-${index}`} sx={{ display: 'list-item' }}>
                    <Typography variant="body2">{ingredient}</Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeItem;
