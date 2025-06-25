"use client";

import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

// Define the props interface for the CustomSearchTextField
interface CustomSearchTextFieldProps {
  id: string;
  placeholderText: string; // Renamed label to placeholderText for consistency with original SearchComponent
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearchIconClick: () => void; // Callback for the search icon click
  isSearchIconDisabled: boolean; // Controls the disabled state of the search icon button
  ariaLabel: string;
}

const CustomSearchTextField: React.FC<CustomSearchTextFieldProps> = ({
  id,
  placeholderText,
  value,
  onChange,
  onKeyDown,
  onSearchIconClick,
  isSearchIconDisabled,
  ariaLabel,
}) => {
  return (
    <TextField
      id={id}
      label={placeholderText} // Using placeholderText as the label
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      fullWidth
      variant="outlined"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              disabled={isSearchIconDisabled}
              onClick={onSearchIconClick}
              aria-label="submit search" // This aria-label is specifically for the icon button
              disableRipple // Keeps the clean interaction
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      aria-label={ariaLabel} // This aria-label is for the text input itself
    />
  );
};

export default CustomSearchTextField;
