import { BrowserRouter, Routes, Route } from 'react-router-dom'

//pages
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Signup from './pages/Signup'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import EmployeesList from './pages/EmployeesList'
import CreateEmployee from './pages/CreateEmployee'
import EditEmployee from './pages/EditEmployee'

function App() {

  return (
   <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<Signup />} />

        <Route element={<PrivateRoute />}> 
          <Route path='/' element={<Home />} />
          <Route path='/employee-list' element={<EmployeesList />} />
          <Route path='/create-employee' element={<CreateEmployee />} />
          <Route path='/edit-employee/:id' element={<EditEmployee />} />
        </Route>

      </Routes>
      
   </BrowserRouter>
  )
}

export default App
