import express from 'express';

import { getUsers } from '../db/user'; // 🧠 use relative path, not 'db/user'

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users); // ✅ proper response format
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}
 