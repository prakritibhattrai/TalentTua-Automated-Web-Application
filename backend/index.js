import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobRoutes.js';
import occupationRoutes from './routes/occupationRoutes.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// // Rate limiting (Uncomment if you want rate-limiting enabled)
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per windowMs
//     message: 'Too many requests from this IP, please try again later.',
// });
//app.use(limiter);

// Configure CORS with more restrictive options
app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// Parse JSON with size limits
app.use(bodyParser.json({ limit: '10mb' })); // Adjust size limits as needed

// Parse URL-encoded bodies with size limits
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/jobs', jobRoutes);
app.use('/occupations', occupationRoutes);

// Create HTTPS server if in production
const server =
    process.env.NODE_ENV === 'production'
        ? https.createServer(
            {
                key: fs.readFileSync(process.env.SSL_KEY_PATH),
                cert: fs.readFileSync(process.env.SSL_CERT_PATH),
            },
            app
        )
        : http.createServer(app);

// Use environment variable for port (default to 3000)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default server;
