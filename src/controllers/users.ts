import express from 'express';
import {
  deleteUserById,
  getUsers,
  updateUserById,
} from '../db/user';

// 🟢 Get all users
export const getAllUsers = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// 🔴 Delete user by ID
export const deleteUser = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(204).send(); // Successfully deleted - No Content
  } catch (error) {
    console.error('Failed to delete user:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};

// 🟡 Update user by ID
export const updateUser = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    if (!username && !email) {
      return res.status(400).json({
        error: 'At least one field (username or email) must be provided for update',
      });
    }

    const updatedUser = await updateUserById(id, { username, email });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Failed to update user:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
};



