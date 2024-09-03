import React, { useEffect, useState } from 'react';
import Word from '../Components/Word';

const Words = () => {
    const [words, setWords] = useState([]); // Initialize words as an empty array
    const [error, setError] = useState(null); // Handle any errors

    useEffect(() => {
        const fetchWords = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/words');
                const data = await response.json();
                
                // Check if the data contains an array
                if (Array.isArray(data)) {
                    setWords(data);
                } else if (data.rows) {
                    // If your API returns an object with a rows array, use that
                    setWords(data.rows);
                } else {
                    // Handle cases where data is not an array or expected structure
                    throw new Error("Unexpected data format");
                }
            } catch (error) {
                console.error('Failed to fetch words:', error);
                setError('Failed to load words');
            }
        };

        fetchWords();
    }, []);

    return (
        <div className="container mx-auto p-4">
            {error ? (
                <p className="text-red-500">{error}</p> // Display error if any
            ) : words.length === 0 ? (
                <p>No words found</p> // Display loading if no words yet
            ) : (
                words.map((word) => (
                    <div key={word.id}>
                        <Word word={word} />
                    </div>
                ))
            )}
        </div>
    );
};

export default Words;
