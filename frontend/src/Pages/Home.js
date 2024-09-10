import React from 'react';
import Words from './Words';  // Full word list
import WordsFound from '../Components/WordsFound';  // New component for search results

function Home({ searchResults }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Word List</h1>

      {/* Conditionally render either the full word list or the search results */}
      {searchResults.length > 0 ? (
        <WordsFound words={searchResults} />  // Display filtered words when searching
      ) : (
        <Words />  // Display full word list when there's no search query
      )}
    </div>
  );
}

export default Home;
