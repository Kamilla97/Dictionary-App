import React, { useState } from 'react';
import { FaVolumeUp, FaThumbsUp, FaThumbsDown, FaChevronDown, FaChevronUp } from 'react-icons/fa';
const config = require('./../config');
const apiUrl = config.API_URL;

const Word = ({ word, disableInteractions = false }) => {
    const [likes, setLikes] = useState(word.statistics.likes);
    const [dislikes, setDislikes] = useState(word.statistics.dislikes);
    const [liked, setLiked] = useState(word.liked);
    const [disliked, setDisliked] = useState(word.disliked);
    const [expandedMeanings, setExpandedMeanings] = useState([]); // Track expanded meanings

    const playAudio = () => {
        if (word.mp3Url) {
            const audio = new Audio(word.mp3Url);
            audio.play();
        }
    };

    const handleLike = async () => {
        if (disableInteractions) return;

        try {
            const response = await fetch(`http://localhost:3000/api/likeWord/${word.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to like the word');
            }

            if (liked) {
                setLikes(likes - 1);
                setLiked(false);
            } else {
                setLikes(likes + 1);
                setLiked(true);

                if (disliked) {
                    setDislikes(dislikes - 1);
                    setDisliked(false);
                }
            }
        } catch (error) {
            console.error('Error liking the word:', error);
        }
    };

    const handleDislike = async () => {
        if (disableInteractions) return;

        try {
            const response = await fetch(`http://localhost:3000/api/dislikeWord/${word.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to dislike the word');
            }

            if (disliked) {
                setDislikes(dislikes - 1);
                setDisliked(false);
            } else {
                setDislikes(dislikes + 1);
                setDisliked(true);

                if (liked) {
                    setLikes(likes - 1);
                    setLiked(false);
                }
            }
        } catch (error) {
            console.error('Error disliking the word:', error);
        }
    };

    // Toggle expanded state for meaning
    const toggleMeaningExpansion = async (meaningId) => {
        const isExpanded = expandedMeanings.includes(meaningId);
        
        if (!isExpanded) {
            // If meaning is expanded, send request to increment view count
            try {
                await fetch(`http://localhost:3000/words/view/${word.id}`, {
                    method: 'POST'
                });
            } catch (error) {
                console.error('Error incrementing view count:', error);
            }
        }

        setExpandedMeanings((prev) => 
            isExpanded 
            ? prev.filter((id) => id !== meaningId) 
            : [...prev, meaningId]
        );
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200 relative">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">{word.headword}</h2>
            <p className="text-gray-600 mb-1">
                <span className="font-medium text-gray-900">Pronunciation:</span> {word.pronunciation}
                {word.mp3Url && (
                    <button onClick={playAudio} className="ml-2 text-gray-700 hover:text-gray-900 focus:outline-none">
                        <FaVolumeUp className="inline-block mr-2" />
                    </button>
                )}
            </p>
            <p className="text-gray-600 mb-1">
                <span className="font-medium text-gray-900">Origin:</span> {word.origin}
            </p>
            <p className="text-gray-600 mb-4">
                <span className="font-medium text-gray-900">Submitted by:</span> {word.user.username}
            </p>
            <div className="absolute right-4 text-sm text-gray-600 flex space-x-4">
                <button
                    onClick={handleLike}
                    className={`flex items-center focus:outline-none ${liked ? 'text-blue-500' : 'text-gray-700'} ${disableInteractions ? 'cursor-not-allowed' : ''}`}
                    disabled={disableInteractions}
                >
                    <FaThumbsUp className="mr-1 hover:text-blue-500" />
                    {likes}
                </button>
                <button
                    onClick={handleDislike}
                    className={`flex items-center focus:outline-none ${disliked ? 'text-red-500' : 'text-gray-700'} ${disableInteractions ? 'cursor-not-allowed' : ''}`}
                    disabled={disableInteractions}
                >
                    <FaThumbsDown className="mr-1 hover:text-red-500" />
                    {dislikes}
                </button>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2 mb-2">
                    Meanings:
                </h3>
                {word.meanings.length > 0 ? (
                    word.meanings.map((meaning) => {
                        const isExpanded = expandedMeanings.includes(meaning.id);
                        return (
                            <div key={meaning.id} className="mb-4">
                                <h4 
                                    className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer flex items-center justify-between"
                                    onClick={() => toggleMeaningExpansion(meaning.id)} // Toggle on click
                                >
                                    {meaning.partOfSpeech}
                                    {isExpanded ? (
                                        <FaChevronUp className="text-gray-600" />
                                    ) : (
                                        <FaChevronDown className="text-gray-600" />
                                    )}
                                </h4>
                                {isExpanded && (
                                    meaning.definitions.length > 0 ? (
                                        <ol className="list-decimal list-inside pl-5 space-y-2">
                                            {meaning.definitions.map((definition) => (
                                                <li key={definition.id} className="text-gray-800">
                                                    {definition.definition}
                                                    {definition.example && (
                                                        <p className="text-gray-600">
                                                            <span className="font-medium text-gray-900">Example:</span> {definition.example}
                                                        </p>
                                                    )}
                                                    {Array.isArray(definition.synonyms) && definition.synonyms.length > 0 && (
                                                        <p className="text-gray-600">
                                                            <span className="font-medium text-gray-900">Synonyms:</span> {definition.synonyms.join(', ')}
                                                        </p>
                                                    )}
                                                    {Array.isArray(definition.antonyms) && definition.antonyms.length > 0 && (
                                                        <p className="text-gray-600">
                                                            <span className="font-medium text-gray-900">Antonyms:</span> {definition.antonyms.join(', ')}
                                                        </p>
                                                    )}
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <p className="text-gray-600">No definitions available.</p>
                                    )
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-600">No meanings available.</p>
                )}
            </div>
        </div>
    );
};

export default Word;
