import express from 'express';
import authentication from './authentication';
import users from './users';

const router = express.Router();

export default (): express.Router => {
  authentication(router); // <-- This line is crucial 
  users(router);
  return router;   
};   
        