import { useState } from "react";
import { Recipe } from "../../utils/together-api/interfaces";
import { askFollowUpQuestion } from "@/utils/together-api/actions";

import { Box, Typography, IconButton, TextField, InputAdornment, styled, CircularProgress, Container } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

// Custom styled TextField for the "Ask for help" input
const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#E0E0E0', // Grey background
    borderRadius: '8px', // Rounded corners
    '& fieldset': {
      borderColor: 'transparent', // No border
    },
    '&:hover fieldset': {
      borderColor: 'transparent', // No border on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: 'transparent', // No border when focused
    },
  },
  '& .MuiInputBase-input': {
    fontStyle: 'italic', // Italic text
    padding: '12px 14px', // Adjust padding
    color: theme.palette.text.secondary, // Lighter text color
  },
  '& .MuiInputLabel-root': {
    fontStyle: 'italic', // Italic placeholder/label
    color: theme.palette.text.secondary, // Lighter text color for label
  },
}));


interface AdditionalInfoProps {
  info: string | undefined;
  recipe: Recipe;
  discard: () => void; // Callback to remove the card
  // New props for displaying follow-up question/answer within the same component
  isFollowUp?: boolean; // To indicate if this is a nested follow-up display
  questionAsked?: string; // The specific question asked for this info block
}

export default function AdditionalInfo({ info, recipe, discard, isFollowUp = false, questionAsked }: AdditionalInfoProps) {
  const [currentFollowUpQuery, setCurrentFollowUpQuery] = useState<string>(''); // State for the follow-up input
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null); // Stores the answer to the follow-up question
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null); // Stores the question that was just asked
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  const handleFollowUpSearch = async () => {
    const trimmedQuery = currentFollowUpQuery.trim();
    if (info && trimmedQuery) {
      setIsLoading(true); // Start loading
      setFollowUpAnswer(null); // Clear previous answer
      setCurrentQuestion(trimmedQuery); // Set the question just asked

      try {
        const response = await askFollowUpQuestion(trimmedQuery, recipe, info);
        setFollowUpAnswer(response);
      } catch (err) {
        console.error("Failed to fetch follow-up info:", err);
        setFollowUpAnswer("Sorry, something went wrong.");
      } finally {
        setIsLoading(false); // End loading
        setCurrentFollowUpQuery(''); // Clear the input after submission
      }
    } else {
      console.log("No previous info or query available to ask a follow-up question.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && currentFollowUpQuery.trim() && !isLoading) {
      event.preventDefault();
      handleFollowUpSearch();
    }
  };

  return (
    <>
      {info && (
        <Box
          sx={{
            border: '2px solid #57D100', // Green border
            borderRadius: '16px', // Rounded corners
            padding: '16px',
            position: 'relative',
            backgroundColor: 'white', // White background for the card
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)', // Optional subtle shadow
            display: 'flex',
            flexDirection: 'column',
            gap: '16px', // Space between elements
            maxWidth: '100%', // Ensure it's responsive
            margin: 'auto', // Center the card
            mt: 2
          }}
        >
          <IconButton
            onClick={discard}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'grey.600', // Adjust color as needed
            }}
            aria-label="discard additional info"
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            Ask anything
          </Typography>

          <Typography variant="body1">
            {info}
          </Typography>

          {isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="success" /> {/* Green loading spinner */}
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                Working hard to help you...
              </Typography>
            </Box>
          )}

          {!isLoading && currentQuestion && followUpAnswer && (
            <>
              <Container maxWidth="md" disableGutters>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {currentQuestion}
                </Typography>
                <Typography variant="body1">
                  {followUpAnswer}
                </Typography>
              </Container>
            </>
          )}

          {/* Custom TextField for "Ask for help" */}
          <CustomTextField
            placeholder="Ask for help"
            fullWidth
            value={currentFollowUpQuery}
            onChange={(e) => setCurrentFollowUpQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleFollowUpSearch}
                    disabled={!currentFollowUpQuery.trim() || isLoading} // Disable while loading
                    aria-label="submit follow-up search"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    </>
  );
}