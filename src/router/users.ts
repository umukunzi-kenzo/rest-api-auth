import express from 'express';
import { deleteUser, getAllUsers, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares'; // ✅ Make sure this path matches your folder name

/**
 * Defines user-related routes.
 * All routes are protected by authentication middleware.
 * Some routes also require ownership validation.
 */
export default (router: express.Router): void => {
  // 🔍 Get all users (admin-only or authenticated endpoint)
  router.get('/users', isAuthenticated, getAllUsers); // temporarly removed isAuthenticated

  // ❌ Delete a user (must be authenticated AND the account owner)
  router.delete('/users/:id',isAuthenticated,isOwner, deleteUser); // temporarly removed isOwner and isAuthenticated

  // ✏️ Update a user (must be authenticated AND the account owner)
  router.put('/users/:id',isAuthenticated, isOwner, updateUser);// temporarly removed isOwner and isAuthenticated
};
   