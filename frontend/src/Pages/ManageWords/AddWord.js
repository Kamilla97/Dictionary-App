// Pages/ManageWords/AddWord.js
import React from 'react';
import WordForm from '../../Components/WordForm';

function AddWord() {
  const handleAddWord = async (wordData) => {
    try {
      const response = await fetch('http://localhost:3000/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Replace with your token handling logic
        },
        body: JSON.stringify(wordData),
      });

      if (!response.ok) {
        throw new Error('Failed to create word');
      }

      const data = await response.json();
      console.log('Word created:', data);
      // Handle success, e.g., redirect or update UI
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Word</h2>
      <WordForm onSubmit={handleAddWord} isEdit={false} />
    </div>
  );
}

export default AddWord;
