'use client';

import { useRouter } from 'next/navigation';
import SearchComponent from '@/components/search/search-component';
import './home-screen-style.css';

export default function Home() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    console.log('Search submitted:', query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <div>
        <h1 className='mainTitle'>
          <span>What would you like </span>
          <span className='bold italic'>to eat?</span>
        </h1>

        <SearchComponent
          placeholderText='What would you like to eat? What do you want to use? What do you have at home?'
          onSearchSubmit={handleSearch}
        ></SearchComponent>
      </div>
    </>
  );
}