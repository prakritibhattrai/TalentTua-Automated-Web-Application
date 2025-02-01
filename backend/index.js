import express from 'express';
import http from 'http';
import https from 'https';  // If using HTTPS in production
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobRoutes.js';
import occupationRoutes from './routes/occupationRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['https://frontend-dot-talenttua-web-application.nn.r.appspot.com'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('CORS policy violation: Origin not allowed'));
            }
        },
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// Your routes here


// Parse JSON with size limits
app.use(bodyParser.json({ limit: '10mb' }));

// Parse URL-encoded bodies with size limits
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/jobs', jobRoutes);
app.use('/occupations', occupationRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        console.error(err.stack);
    } else {
        console.error(err);
    }

    res.status(500).json({
        message: 'Something went wrong. Please try again later.',
    });
});

// Create server (App Engine handles SSL in production)
const server = http.createServer(app);

// Use environment variable for port (default to 8080)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default server;
