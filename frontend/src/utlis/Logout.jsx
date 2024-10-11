import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice';

export default function Logout() {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/backend/auth/signout')

      const data = res.json()
      if(data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return
      }

      dispatch(signOutUserSuccess(data))
      navigate('/signin')

    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  return (
   <div className="">
     <button 
        onClick={handleSignOut}
        className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 
        transition-all ease-in-out duration-200'>
            Logout
    </button>
   </div>
  )
}
