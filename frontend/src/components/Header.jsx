import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Logout from '../utlis/Logout';

export default function Header() {

  const{ currentUser } = useSelector((state) => state.user)
  


  return (
    <header className='border-b-2 p-4 flex items-center justify-between mx-auto w-full
       bg-white shadow-sm cursor-pointer'>
        <h1 className='font-bold text-lg sm:text-xl'>
            <span className='text-slate-500'>MERN </span>
            <span className='text-slate-700'>ADMIN PANEL</span>
        </h1>

        <nav className='flex-1 flex justify-center'>
         <>
          { currentUser ? (
             <ul className='flex items-center gap-6'>
             <li>
               <Link to="/" className='text-slate-700 hover:text-slate-500 px-4 py-2 
                 rounded-lg transition-all ease-in-out duration-200'>
                 Home
               </Link>
             </li>
 
             <li>
               <Link to="/employee-list" className='text-slate-700 hover:text-slate-500 
                 px-4 py-2 rounded-lg transition-all ease-in-out duration-200'>
                 Employee List
               </Link>
             </li>
           </ul>

          ) : (
            <p>
              
            </p>
          )
          
        }
         </>
        </nav>

        <div className="flex items-center space-x-4">
            { currentUser ? (
              <>
                <span className='text-slate-700 font-medium'>
                  Hello, { currentUser.username }
                </span>

                <Logout />
              </>
            ) : (
                <Link to='/signin' className='text-slate-700 hover:text-slate-500'>
                  
                </Link>
            ) }

        
        </div>
    </header>
  )
}
