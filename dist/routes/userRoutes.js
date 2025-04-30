import express from "express";
import { deleteUser, editUser, getUsers, } from "../controllers/userController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/users", protectAdmin, getUsers);
router.put("/users/:id", protectAdmin, editUser);
router.delete("/users/:id", protectAdmin, deleteUser);
export default router;
