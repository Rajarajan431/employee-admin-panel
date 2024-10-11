import Employee from "../models/employeeModel.js"
import { errorHandler } from "../utils/errorHandler.js";

export const createEmployee = async(req, res, next) => {
    try {
        const employee = await Employee.create(req.body);
        return res.status(201).json(employee)
    } catch (error) {
        next(error)
    }
}

export const getEmployee = async(req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if(!employee) {
            return next(errorHandler(404, 'Employee is not found'));
        }

        res.status(200).json(employee)

    } catch (error) {
        next(error)
    }
}

export const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find(); 
        res.status(200).json(employees);
    } catch (error) {
        next(error);
    }
};

export const deleteEmployee = async (req, res, next) => {

    try {
        await Employee.findByIdAndDelete(req.params.id)
        res.status(200).json('Employee details has been deleted')
    } catch (error) {
        next(error)
    }
}

export const updateList = async (req, res, next) => {

    try {
        const updateList = await Employee.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        res.status(200).json(updateList);

    } catch (error) {
        next(error)
    }
}


export const searchEmployee = async (req, res) => {
    const { q } = req.query;
  
    try {
     
      const isObjectId = q.match(/^[0-9a-fA-F]{24}$/); 
  
      let employees;
      if (isObjectId) {
        employees = await Employee.find({ _id: q });
      } else {
        employees = await Employee.find({
          $or: [
            { name: { $regex: q, $options: 'i' } }, 
            { email: { $regex: q, $options: 'i' } }, 
            { mobile: { $regex: q, $options: 'i' } }, 
          ]
        });
      }
  
      res.status(200).json(employees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };


  export const sortEmployee = async (req, res, next) => {
    const { sortField = 'name', sortOrder = 'asc' } = req.query;
  
    const validSortFields = ['name', 'email', 'id', 'date']; 
  
    if (!validSortFields.includes(sortField)) {
      return res.status(400).json({ message: 'Invalid sort field' });
    }
  
    try {
      const sort = {
        [sortField]: sortOrder === 'asc' ? 1 : -1
      };

      const employees = await Employee.find().sort(sort);
      res.json(employees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch employees' });
    }
  };
  