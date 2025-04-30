import express from "express";
import { forgotPassword, loginUser, registerUser, resetPassword, verifyEmail } from "../controllers/authController.js"



const router = express.Router()


router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/forgot", forgotPassword)
router.post("/reset-password", resetPassword)
router.get('/verify-email', verifyEmail);





export default router