import express from 'express';
import { deleteUser, getAllUsers, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

/**
 * Defines user-related routes.
 * All routes are protected by authentication middleware.
 * Some routes also require ownership validation.
 */
export default (router: express.Router): void => {
  // 🔍 Get all users (admin-only or authenticated endpoint)
  router.get('/users', isAuthenticated, getAllUsers);

  // ❌ Delete a user (must be authenticated AND the account owner)
  router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);

  // ✏️ Update a user (must be authenticated AND the account owner)
  router.put('/users/:id', isAuthenticated, isOwner, updateUser);
};
