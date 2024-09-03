import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';

function ContributorPanel() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Contributor Panel</h2>
      
      {/* Navigation buttons */}
      <div className="flex space-x-4 mb-6">
        <Link to="manage-words" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Manage Words
        </Link>
        <Link to="add-word" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Word
        </Link>
      </div>

      <Routes>
        <Route path="manage-words" element={<WordsList />} />
        <Route path="add-word" element={<AddWord />} /> 
      </Routes>
    </div>
  );
}

export default ContributorPanel;
