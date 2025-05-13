// my original code

import express from 'express';
import { getUserByEmail, createUser } from '../db/user'; 
import { authentication, random } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {  
            return res.status(400).json({ error: 'User not found' });
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.status(403).json({ error: 'Incorrect password' });
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        console.log("Generated Session Token:", user.authentication.sessionToken);
        user.lastActive = new Date();

        await user.save();

        // Set cookie with proper settings
        res.cookie('KENZO-AUTH', user.authentication.sessionToken, { 
            path: '/', // Cookie accessible throughout the entire domain
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            sameSite: 'none', // ← THIS is crucial! Use 'None' if using different domains AND HTTPS
            secure: true, // Set to true if using HTTPS in production
            maxAge:86400000, // Cookie expiration time (1 day for example)
            domain: 'localhost'
        }); 


        return res.status(200).json({  
            _id: user._id,
            username: user.username,  
            email: user.email,
            sessionToken: user.authentication.sessionToken // Send token directly
        });
 

    } catch (error) {
        console.log('Error during login:', error);
        return res.status(500).json({ error: 'Server error during login' });
    }
};

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Email, password, and username are required' });
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const salt = random();
        const user = await createUser({
            email, 
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        return res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email
        }).end();

    } catch (error) {
        console.log('Error during registration:', error);
        return res.status(500).json({ error: 'Server error during registration' });
    }
};

