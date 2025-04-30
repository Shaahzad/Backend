import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { Request, Response } from 'express';
import sendEmail from '../utils/sendEmail.js';



export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    
    if (!username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword, 
    });
    
    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1d' }
    );
    const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;
    sendEmail(newUser.email, 'Please verify your email', `Click here to verify: ${verificationLink}`);

    res.status(201).json({ 
      message: 'User created successfully',
      token,      
    });

  } catch (error) {
    console.error('Registration error:', error);
  }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: "Account is not active" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1d' }
    );


    res.status(200).json({ 
      message: "Login successful", 
      token,
      user:{
        username: user.username,
        email: user.email
      }
});

  } catch (error) {
    console.error('Login error:', error);
  }
}

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    await sendEmail(
      user.email,
      "Reset Your Password",
      `Click here to reset your password: ${resetLink}`
    );

    res.status(200).json({ message: "Password reset link sent" });

  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ message: "Token and new password are required" });
      return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });

  } catch (error: any) {
    console.error("Reset password error:", error);

    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired. Please request a new reset link." });
    } else {
      res.status(400).json({ message: "Invalid token or request" });
    }
  }
};
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      res.status(400).json({ message: 'Invalid or missing token' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Invalid or expired token' });
  }
};

