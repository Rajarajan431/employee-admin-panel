import express from 'express';
import { 
    createEmployee, deleteEmployee, 
    getAllEmployees, getEmployee, 
    searchEmployee, sortEmployee, updateList
} from '../controllers/listingController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createEmployee)
router.get('/get/:id', getEmployee)
router.get('/getAll/', getAllEmployees)
router.delete('/delete/:id', verifyToken, deleteEmployee)
router.put('/update/:id', updateList)
router.get('/search', searchEmployee);
router.get('/sort', sortEmployee) 

export default router;