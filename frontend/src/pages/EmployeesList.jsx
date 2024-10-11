import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import SortComponent from '../components/SortComponent'; 
import { FaSpinner } from 'react-icons/fa';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false); 
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
 
  const navigate = useNavigate();
 
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/backend/employee/getAll';
      if (searchQuery) {
        url = `/backend/employee/search?q=${searchQuery}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Failed to fetch employees: ${errorData || res.status}`);
      }
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearchEmployees = useCallback(
    debounce(async () => {
      try {
        setIsSearching(true); 
        let url = `/backend/employee/sort?sortField=${sortField}&sortOrder=${sortOrder}`;

        if (searchQuery) {
          url += `&q=${searchQuery}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(`Failed to fetch employees: ${errorData || res.status}`);
        }
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [searchQuery, sortField, sortOrder]
  );


  const debouncedFetchEmployees = useCallback(debounce(fetchEmployees, 500), [searchQuery]);

  useEffect(() => {
    debouncedFetchEmployees();
    debouncedSearchEmployees();
    return debouncedFetchEmployees.cancel;
  }, [debouncedFetchEmployees, debouncedSearchEmployees]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDelete = async (employeeId) => {
    try {
      const res = await fetch(`/backend/employee/delete/${employeeId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== employeeId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const indexOfLastEmployee = currentPage * rowsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - rowsPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(employees.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">
        Employees List
      </h1>

      {error && (
        <div className="bg-red-500 text-white p-2 rounded-md mb-4">
          {error}
        </div>
      )}

<div className="flex items-center justify-end mb-4 p-2 space-x-12">
    <span className="text-xl">Total Count: {employees.length}</span>
    <Link to="/create-employee">
      <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition shadow-md">
        Create Employee
      </button>
    </Link>
  </div>

  <div className="flex flex-col md:flex-row justify-end mb-4 space-y-4 md:space-y-0 md:space-x-4">
   
    <div className="max-w-[370px] flex justify-center items-center">
      <SortComponent onSort={handleSort} />
    </div>

    <div className="w-full md:w-1/2 lg:w-1/3">
      <form onSubmit={(e) => e.preventDefault()} className="relative">
        <input
          type="text"
          id="search"
          placeholder="Search by name, email, mobile, or ID"
          className="border-2 border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      
        {isSearching && (
          <div className="absolute right-2 top-2">
            <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-gray-500 rounded-full"></span>
          </div>
        )}
      </form>
    </div>
  </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-600 text-sm uppercase">
            <tr>
              <th className="border border-gray-300 p-4 text-left">ID</th>
              <th className="border border-gray-300 p-4 text-left">Image</th>
              <th className="border border-gray-300 p-4 text-left">Name</th>
              <th className="border border-gray-300 p-4 text-left">Email</th>
              <th className="border border-gray-300 p-4 text-left">Mobile No</th>
              <th className="border border-gray-300 p-4 text-left">Designation</th>
              <th className="border border-gray-300 p-4 text-left">Gender</th>
              <th className="border border-gray-300 p-4 text-left">Courses</th>
              <th className="border border-gray-300 p-4 text-left">Created Date</th>
              <th className="border border-gray-300 p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center p-4">
                  Loading employees...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="10" className="border border-gray-300 p-4 text-center text-gray-600">
                  No Employees Found
                </td>
              </tr>
            ) : (
              currentEmployees.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 p-4">{employee._id}</td>
                  <td className="border border-gray-300 p-4">
                    {employee.image ? (
                      <img src={employee.image} alt="Employee" className="w-16 h-16 object-cover rounded-full" />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-4">{employee.name}</td>
                  <td className="border border-gray-300 p-4">{employee.email}</td>
                  <td className="border border-gray-300 p-4">{employee.mobile}</td>
                  <td className="border border-gray-300 p-4">{employee.designation}</td>
                  <td className="border border-gray-300 p-4">{employee.gender}</td>
                  <td className="border border-gray-300 p-4">{employee.courses.join(', ')}</td>
                  <td className="border border-gray-300 p-4">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-4">
                    <button
                      onClick={() => handleEdit(employee._id)}
                      className="bg-blue-400 text-white px-4 py-1 rounded-lg shadow-md
                         hover:bg-blue-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="bg-red-500 text-white px-4 py-1 ml-2 rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center space-x-5 items-center mt-6 cursor-pointer">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          Previous
        </button>

        <span className="text-lg font-semibold text-gray-700">
          Page {currentPage} of {Math.ceil(employees.length / rowsPerPage)}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(employees.length / rowsPerPage)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;
