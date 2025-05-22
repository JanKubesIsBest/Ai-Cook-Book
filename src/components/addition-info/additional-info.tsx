import { useState } from "react";
import SearchComponent from "../search/search-component";
import TogetherAPI from "@/utils/together-api/recipe-utils";
import styles from "./AdditionalInfo.module.css";
import { Recipe } from "../../utils/together-api/interfaces";
import { askFollowUpQuestion } from "@/utils/together-api/actions";

interface AdditionalInfoProps {
  info: string | undefined;
  recipe: Recipe;
  discard: () => void; // Callback to remove the card
}

export default function AdditionalInfo({ info, recipe, discard }: AdditionalInfoProps) {
  const [followUpResponse, setFollowUpResponse] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (info) {
      try {
        const response = await askFollowUpQuestion(query, recipe, info);
        setFollowUpResponse(response);
      } catch (err) {
        console.error("Failed to fetch follow-up info:", err);
        setFollowUpResponse("Sorry, something went wrong.");
      }
    } else {
      console.log("No previous info available to ask a follow-up question.");
    }
  };

  return (
    <>
      {info && (
        <div className={`${styles.additionalInfo} ${styles.show}`}>
          <img
            src="/discard_icon.svg"
            alt="Discard additional info"
            className={styles.discardIcon}
            onClick={discard} // Call the discard callback
          />
          <div className={styles.contentWrapper}>
            <span className="text">{info}</span>
            <div className={styles.searchContainer}>
              <SearchComponent
                placeholderText="Type in your question..."
                onSearchSubmit={handleSearch}
              />
            </div>
            {followUpResponse && (
              <AdditionalInfo
                info={followUpResponse}
                recipe={recipe}
                discard={() => setFollowUpResponse(null)} // Discard follow-up card
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}