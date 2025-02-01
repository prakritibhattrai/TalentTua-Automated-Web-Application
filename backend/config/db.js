import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
// Create connection to the MySQL database
const db = mysql.createConnection({
    host: process.env.DB_HOST,     // MySQL server host
    user: process.env.DB_USER,          // MySQL username
    password: process.env.DB_PASSWORD,          // MySQL password
    database: process.env.DB_NAME    // Database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        return;
    }
});
export default db;