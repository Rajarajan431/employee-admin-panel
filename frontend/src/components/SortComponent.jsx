import React, { useState } from 'react'

export default function SortComponent({ onSort }) {
    const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSortChange = () => {
    onSort(sortField, sortOrder);
  };

  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="sortField">Sort by:</label>
      <select
        id="sortField"
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
        className='bg-gray-100 rounded-lg'
      >
        <option value="name">Name</option>
        <option value="id">ID</option>
        <option value="email">Email</option>
        <option value="date">Date</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className='bg-gray-100 rounded-lg'
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <button
        onClick={handleSortChange}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Sort
      </button>
    </div>
  )
}
