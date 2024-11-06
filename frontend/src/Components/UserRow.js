import React, { useState } from 'react';
import { FaEye, FaPen, FaTrash } from 'react-icons/fa';


const config = require('./../config');
const apiUrl = config.API_URL;

function UserRow({ user, setUsers }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Placeholder for edit and delete functions
  const handleEditUser = () => {
    // Add logic to edit user details
    setEditModalOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      await fetch(`${apiUrl}/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Update parent state to remove deleted user
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <tr className="bg-white hover:bg-gray-50 border-b border-gray-200 transition-all">
      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
        {user.username}
      </td>
      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
        {user.email}
      </td>
      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
        {user.role}
      </td>
      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
        <div className="flex space-x-2">
          <button
            onClick={() => setEditModalOpen(true)}
            className="text-yellow-500 hover:text-yellow-600 transition"
          >
            <FaPen />
          </button>
          <button
            onClick={() => handleDeleteUser()}
            className="text-red-500 hover:text-red-600 transition"
          >
            <FaTrash />
          </button>
        </div>
      </td>

      {/* Edit and Delete modals can be added here */}
      {editModalOpen && <div>Edit Modal</div>}
      {deleteModalOpen && <div>Delete Modal</div>}
    </tr>
  );
}

export default UserRow;
