import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getUser } from "../controllers/userController.js";

const router = express.Router();

router.get('/:id', verifyToken, getUser)

export default router;