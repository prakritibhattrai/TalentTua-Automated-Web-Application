import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import jobRoutes from './routes/jobRoutes.js';
import occupationRoutes from './routes/occupationRoutes.js';

dotenv.config();

const app = express();
app.options('*', cors());  // This will handle preflight requests for all routes
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['https://frontend-dot-talenttua-web-application.nn.r.appspot.com', 'http://localhost:5173', 'http://192.168.1.68:5173'];

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
// Routes
app.use('/jobs', jobRoutes);
app.use('/occupations', occupationRoutes);


// Start the server (if you need the server running for other purposes)
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default server;
