// Pages/ManageWords/DeleteWordModal.js
import React from 'react';
const config = require('./../config');
const apiUrl = config.API_URL;
function DeleteWordModal({ wordId, onClose, setWords }) {
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    await fetch(`${apiUrl}/api/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    // Optionally update the state of words in the parent component
    setWords(prevWords => prevWords.filter(w => w.id !== wordId));

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Delete Word</h2>
        <p>Are you sure you want to delete this word?</p>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        <button onClick={onClose} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
}

export default DeleteWordModal;
