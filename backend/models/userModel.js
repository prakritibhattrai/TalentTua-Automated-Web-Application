import db from '../config/db.js';

const UserModel = {
    createUser: (userData, callback) => {
        const sql = `INSERT INTO users (name, email, phone, company) VALUES (?, ?, ?, ?)`;
        const { name, email, phone, company } = userData;
        db.query(sql, [name, email, phone, company], callback);
    },

    getUserById: (userId, callback) => {
        const sql = `SELECT id, name, email, role FROM users WHERE id = ?`;
        db.query(sql, [userId], callback);
    },

    getAllUsers: (callback) => {
        const sql = `SELECT id, name, email, role FROM users`;
        db.query(sql, callback);
    },

    updateUser: (userId, userData, callback) => {
        const sql = `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`;
        const { name, email, role } = userData;
        db.query(sql, [name, email, role, userId], callback);
    },

    deleteUser: (userId, callback) => {
        const sql = `DELETE FROM users WHERE id = ?`;
        db.query(sql, [userId], callback);
    }
};

export default UserModel;
