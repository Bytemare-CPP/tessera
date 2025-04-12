/*
    Thisis the main entry point of the Express server.
    It configures middleware, routes, and starts the server.
*/

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { authenticate } from './middleware/authMiddleware';

// Import route groups
// import authRoutes from './routes/authRoutes';
import  userRoutes  from './routes/userRoutes';
import connectionRoutes from './routes/connectionRoutes';
import { postRoutes } from './routes/postsRoutes';
import { postMediaRoutes } from './routes/postMediaRoutes';

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware Setup
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
}));
app.use(express.json());    // Parse incoming JSON data
app.use(morgan('dev'));     // Log incoming requests

// Protect API routes with the authenticate middleware
app.use('/api/users', authenticate, userRoutes);
app.use('/api/connections', authenticate, connectionRoutes);
app.use('/api/posts', authenticate, postRoutes);
app.use('/api/post-media', authenticate, postMediaRoutes);

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Tessera server is running on http://localhost:${PORT}`);
});