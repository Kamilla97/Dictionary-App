import React from 'react';
import WordForm from '../Components/WordForm';
const config = require('./../config');
const apiUrl = config.API_URL;

function EditWordModal({ word, onClose, setWords }) {
  const handleSave = async (updatedWordData) => {
    try {
      const response = await fetch(`${apiUrl}/api/words/${word.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedWordData),
      });

      if (!response.ok) {
        throw new Error('Failed to update word');
      }

      const data = await response.json();
      console.log('Word updated:', data);

      // Update the word list with the new word data
      setWords(prevWords =>
        prevWords.map(w => (w.id === word.id ? { ...w, ...updatedWordData } : w))
      );

      onClose(); // Close the modal after saving
    } catch (error) {
      console.error('Error updating word:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded w-full max-w-4xl h-[500px] overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4">Edit Word</h2>
        <WordForm initialWord={word} onSubmit={handleSave} isEdit={true} />
        <button onClick={onClose} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
}

export default EditWordModal;
