import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { IUser } from '../models/userModel.js';


declare global {
    namespace Express {
      interface Request {
        user?: IUser;
      }
    }
  }
  
export const protectAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return
  } 
  
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);
    
    if (user?.role !== 'admin') {
        res.status(403).json({ message: 'Access denied' });
        return 
    } 
    
    req.user = user;
    next();

  } catch (error) {
    console.error(error);
  }
};
