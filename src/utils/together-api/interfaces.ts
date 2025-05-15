
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