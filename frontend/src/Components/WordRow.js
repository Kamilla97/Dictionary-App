import React, { useState } from 'react';
import { FaEye, FaPen, FaTrash } from 'react-icons/fa'; // Import icons from react-icons
import ViewWordModal from './ViewWordModal';
import EditWordModal from './EditWordModal';
import DeleteWordModal from './DeleteWordModal';
const config = require('./../config');
const apiUrl = config.API_URL;

function WordRow({ word, setWords }) {
  const [status, setStatus] = useState(word.status);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Handle status change
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    // Send PUT request to update status
    await fetch(`http://localhost:3000/api/words/${word.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    // Optionally update the state of words in the parent component
    setWords((prevWords) =>
      prevWords.map((w) => (w.id === word.id ? { ...w, status: newStatus } : w))
    );
  };

  return (
    <tr className="bg-white hover:bg-gray-50 border-b border-gray-200 transition-all">
      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
        {word.headword}
      </td>
      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
        {word.user.username}
      </td>
      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewModalOpen(true)}
            className="text-blue-500 hover:text-blue-600 transition"
          >
            <FaEye />
          </button>
          <button
            onClick={() => setEditModalOpen(true)}
            className="text-yellow-500 hover:text-yellow-600 transition"
          >
            <FaPen />
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="text-red-500 hover:text-red-600 transition"
          >
            <FaTrash />
          </button>
        </div>
      </td>
      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
        <select
          value={status}
          onChange={handleStatusChange}
          className="border rounded px-2 py-1 bg-gray-100 hover:bg-gray-200 transition text-gray-700"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
      </td>

      {viewModalOpen && <ViewWordModal word={word} onClose={() => setViewModalOpen(false)} />}
      {editModalOpen && <EditWordModal word={word} setWords={setWords} onClose={() => setEditModalOpen(false)} />}
      {deleteModalOpen && <DeleteWordModal wordId={word.id} onClose={() => setDeleteModalOpen(false)} setWords={setWords} />}
    </tr>
  );
}

export default WordRow;
