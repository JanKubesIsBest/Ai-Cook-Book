// components/SearchComponent.tsx
"use client"; // Directive for Next.js App Router Client Component

import React, { useState } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import styles from './SearchComponent.module.css';

// Props interface
interface SearchComponentProps {
  placeholderText: string;
  onSearchSubmit: (query: string) => void;
  initialValue?: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  placeholderText,
  onSearchSubmit,
  initialValue = '',
}) => {
  const [currentQuery, setCurrentQuery] = useState<string>(initialValue);

  // Handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuery(event.target.value);
  };

  // Handle Enter key press for submission
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && currentQuery.trim()) {
      event.preventDefault();
      onSearchSubmit(currentQuery.trim());
    }
  };

  // Handle click on the search icon for submission
  const handleIconClick = () => {
    if (currentQuery.trim()) {
      onSearchSubmit(currentQuery.trim());
    }
  };

  return (
    // Combine CSS module class with global utility classes like 'padding-small'
    <div className={`${styles.searchComponent} padding-small`}>
      <input
        type="text bold"
        // Combine CSS module class with global utility classes like 'text'
        className={`${styles.searchInput} text`}
        placeholder={placeholderText}
        value={currentQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-label="Search"
      />
      <Image
        src="/search.svg" // Assuming search.svg is in the /public directory
        alt="Search"
        width={18} // Specify width (adjust as needed)
        height={18} // Specify height (adjust as needed)
        className={styles.searchIcon}
        onClick={handleIconClick}
        role="button" // Make it behave like a button for accessibility
        aria-label="Submit search"
      />
    </div>
  );
};

export default SearchComponent;