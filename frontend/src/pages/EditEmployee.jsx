import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    courses: [],
    image: '', 
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`/backend/employee/get/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch employee details');
        }
        const data = await res.json();
        setFormData(data); 
        setDataLoaded(true); 
      } catch (error) {
        setError(error.message);
        setDataLoaded(true);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedCourses = [...formData.courses];

    if (checked) {
      updatedCourses.push(value);
    } else {
      updatedCourses = updatedCourses.filter((course) => course !== value);
    }
    setFormData({ ...formData, courses: updatedCourses });
  };

  const handleImageUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.image;
      if (file) {
        imageUrl = await handleImageUpload(file);
      }

      const response = await fetch(`/backend/employee/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, image: imageUrl }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update employee');
      }

      navigate('/employee-list');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (!dataLoaded) return <div className="text-center py-4">Loading...</div>;

  if (error) return <div className="text-center text-red-600 py-4">Error: {error}</div>;

  return (
    <div className='border-2 mx-auto px-10 py-10 my-10 max-w-md sm:max-w-2xl rounded-xl'>
      <h1 className='text-center font-bold text-xl'>Edit Employee</h1>

      <form className='flex flex-col gap-4 p-4' onSubmit={handleSubmit}>

        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border-2 p-2 rounded-xl w-full"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border-2 p-2 rounded-xl w-full"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="border-2 p-2 rounded-xl w-full"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="designation">Designation</label>
          <select
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            className="border-2 p-2 rounded-xl w-full"
          >
            <option value="" disabled>Select Designation</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="gender">Gender</label>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
              /> Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
              /> Female
            </label>
          </div>
        </div>

        <div className="flex flex-col">
          <label>Courses</label>
          <div>
            <label>
              <input
                type="checkbox"
                value="MCA"
                checked={formData.courses.includes("MCA")}
                onChange={handleCheckboxChange}
              /> MCA
            </label>
            <label>
              <input
                type="checkbox"
                value="BCA"
                checked={formData.courses.includes("BCA")}
                onChange={handleCheckboxChange}
              /> BCA
            </label>
            <label>
              <input
                type="checkbox"
                value="BSC"
                checked={formData.courses.includes("BSC")}
                onChange={handleCheckboxChange}
              /> BSC
            </label>
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            className="border-2 p-2 rounded-xl w-full"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className='mt-4 bg-blue-500 text-white p-2 rounded-xl' disabled={loading}>
          {loading ? 'Updating...' : 'Update Employee'}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default EditEmployee;
