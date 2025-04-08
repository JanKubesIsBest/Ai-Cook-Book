import { useState } from 'react';
import { Recipe } from '@/utils/together-api/recipe-utils';
import SearchComponent from '../search/search-component';
import TogetherAPI from '@/utils/together-api/recipe-utils';
import styles from './AdditionalInfo.module.css';

interface AdditionalInfoProps {
  info: string | undefined;
  recipe: Recipe;
}

export default function AdditionalInfo({ info, recipe }: AdditionalInfoProps) {
  const [followUpResponse, setFollowUpResponse] = useState<string | null>(null);
  const together = new TogetherAPI();

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
          <div className={styles.searchContainer}>
            <SearchComponent
              placeholderText="Some other questions?"
              onSearchSubmit={handleSearch}
            />
          </div>
          {followUpResponse && (
            <AdditionalInfo info={followUpResponse} recipe={recipe} />
          )}
        </div>
      )}
    </>
  );
}