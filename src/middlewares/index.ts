import express from 'express';
import { get, merge } from 'lodash';
import { getUserBySessionToken } from '../db/user';

// 🛡️ Middleware: Verifies if the user is authenticated

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const sessionToken = req.cookies['KENZO-AUTH'];
    console.log("Session Token Received in Middleware:", sessionToken);
 



    if (!sessionToken) {
      res.status(403).json({ error: 'No session token provided' });
      return;
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      res.status(403).json({ error: 'Invalid session token' });
      return;
    }

    // Attach authenticated user info to request
    merge(req, { identity: existingUser });

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Error authenticating user' });
  }
};



// 🔐 Middleware: Verifies if the user is accessing their own resource
export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as string;



    if (!currentUserId) {
      res.status(403).json({ error: 'User not authenticated' });
      return;
    }

    if (currentUserId.toString() !== id) {
      res.status(403).json({ error: 'Unauthorized to access this resource' });
      return;
    }

    next();
  } catch (error) {
    console.error('Ownership check middleware error:', error);
    res.status(500).json({ error: 'Error checking ownership' });
  }
};
