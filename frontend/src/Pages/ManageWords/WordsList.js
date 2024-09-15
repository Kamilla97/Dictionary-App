import React, { useState, useEffect } from 'react';
import WordRow from '../../Components/WordRow';

function WordsList() {
  const [words, setWords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(0);   // Track total pages
  const [loading, setLoading] = useState(false);     // Track loading state
  const limit = 10;                                  // Set limit per page

  useEffect(() => {
    // Fetch words from API based on current page
    const fetchWords = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/wordsToManage?page=${currentPage}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setWords(data.words);
        setTotalPages(data.totalPages); // Set the total number of pages
      } catch (error) {
        console.error('Error fetching words:', error);
      }
      setLoading(false);
    };

    fetchWords();
  }, [currentPage]); // Refetch when currentPage changes

  // Handle changing pages
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Words List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Headword
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {words.map((word) => (
                <WordRow key={word.id} word={word} setWords={setWords} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default WordsList;
