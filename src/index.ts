import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import router from './router';
import { connectDB } from './db';

// Load environment variables early  
dotenv.config(); 

// Connect to database
connectDB();

const app = express();

app.use(cors({
  credentials: true,
  origin: ['http://127.0.0.1:5500','http://127.0.0.1:5501', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.options('*', cors()); // Handle all OPTIONS requests

  

  
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Mount routes   
app.use('/', router());

// Start the server
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
  