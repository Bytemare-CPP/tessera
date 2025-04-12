import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define a custom request interface with the user property
interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!) as string | JwtPayload; // Verify token
    req.user = decoded; // Attach decoded user info to the request
    next();
  } catch {
    res.status(403).json({ error: 'Forbidden: Invalid token' });
    return;
  }
};