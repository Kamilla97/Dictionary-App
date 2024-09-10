import React from 'react';
import Word from './Word';  // Assuming Word is the component to display each word

const WordsFound = ({ words }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {words.map((word) => (
        <Word key={word.id} word={word} />
      ))}
    </div>
  );
};

export default WordsFound;
