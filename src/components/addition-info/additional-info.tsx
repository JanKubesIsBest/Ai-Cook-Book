import { useState } from 'react';
import { Recipe } from '@/utils/together-api/recipe-utils';
import SearchComponent from '../search/search-component';
import TogetherAPI from '@/utils/together-api/recipe-utils'; // Ensure this import matches your file structure
import styles from './AdditionalInfo.module.css';

interface AdditionalInfoProps {
  info: string | undefined; // The additional info text, undefined if not present
  recipe: Recipe;
}

export default function AdditionalInfo({ info, recipe }: AdditionalInfoProps) {
  const [followUpResponse, setFollowUpResponse] = useState<string | null>(null);
  const together = new TogetherAPI(); // Instantiate the TogetherAPI class

  const handleSearch = async (query: string) => {
    if (info) {
      try {
        const response = await together.askFollowUpQuestion(query, recipe, info);
        setFollowUpResponse(response);
      } catch (err) {
        console.error('Failed to fetch follow-up info:', err);
        setFollowUpResponse('Sorry, something went wrong.');
      }
    } else {
      console.log('No previous info available to ask a follow-up question.');
    }
  };

  return (
    <>
      {info && (
        <div className={`${styles.additionalInfo} ${styles.show}`}>
          <span className="text">{info}</span>
          <SearchComponent 
            placeholderText="Some other questions?"
            onSearchSubmit={handleSearch}
          />
          {followUpResponse && (
            <AdditionalInfo info={followUpResponse} recipe={recipe}></AdditionalInfo>
          )}
        </div>
      )}
    </>
  );
}