import mysql from 'mysql2';

// Create connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',     // MySQL server host
    user: 'root',          // MySQL username
    password: '',          // MySQL password
    database: 'talenttua'    // Database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
});
export default db;