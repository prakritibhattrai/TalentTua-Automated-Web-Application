import db from '../config/db.js'

const OnetModel = {
    createJob: (jobData, callback) => {
        const sql = `
            INSERT INTO jobs (title, description, company_id, user_id, industry)
            VALUES (?, ?, ?, ?, ?)
        `;
        const { title, description, company_id, user_id, industry } = jobData;
        db.query(sql, [title, description, company_id, user_id, industry], callback);
    },

    getJobsByUserId: (userId, callback) => {
        const sql = `SELECT * FROM jobs WHERE user_id = ?`;
        db.query(sql, [userId], callback);
    },

    getJobsByIndustry: (industry, callback) => {
        const sql = `SELECT * FROM jobs WHERE industry = ?`;
        db.query(sql, [industry], callback);
    }
};

export default OnetModel;
