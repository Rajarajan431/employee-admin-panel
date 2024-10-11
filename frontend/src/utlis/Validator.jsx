import * as z from 'zod';

export const employeeFormSchema = z.object({
    name: z.string().min(3, 'Name is required'),
    email: z.string().email('Invalid email').max(400, 'Email is required'),
    mobile: z.string().min(10, 'Mobile number is required'),
    designation: z.string().min(10, 'Designation is required'),
    gender: z.string().min(1, 'Gender is required'),
    courses: z.array(z.string()).min(1, 'Select at least one course'),
    image: z.array().min(1, "Upload atleast 1 image")
})