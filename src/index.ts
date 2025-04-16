import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './db';
connectDB();



const app = express();
app.use(cors({
  credentials: true
}));

 
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

 
const server = http.createServer(app); 

server.listen(3000, () => { 
  console.log('Server running on port 3000'); 
});
dotenv.config();

 