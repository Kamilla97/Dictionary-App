import React from 'react';
import Word from './Word'; // Assuming Word component is in the same folder

function ViewWordModal({ word, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded w-full max-w-4xl h-[500px] overflow-y-auto relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full z-10">
          Close
        </button>
        {/* Word Component */}
        <div className="pt-10"> {/* Add padding to avoid overlap */}
          <Word word={word} disableInteractions={true} />
        </div>
      </div>
    </div>
  );
}

export default ViewWordModal;
