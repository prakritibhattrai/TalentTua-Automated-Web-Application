import UserModel from '../models/userModel.js'

const UserController = {
    createUser: (req, res) => {
        const userData = req.body;

        if (!userData.name || !userData.email || !userData.phone || !userData.company) {
            return res.status(400).send('All fields are required');
        }

        UserModel.createUser(userData, (err, result) => {
            if (err) {
                console.error('Error creating user:', err);
                return res.status(500).send('Failed to create user');
            }
            res.status(201).send({ success: true, data: { id: result.insertId, ...userData } });
        });
    },

    getUserById: (req, res) => {
        const { user_id } = req.params;

        UserModel.getUserById(user_id, (err, result) => {
            if (err) {
                console.error('Error fetching user:', err);
                return res.status(500).send('Failed to fetch user');
            }

            if (!result.length) {
                return res.status(404).send('User not found');
            }

            res.send(result[0]);
        });
    },

    getAllUsers: (req, res) => {
        UserModel.getAllUsers((err, results) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).send('Failed to fetch users');
            }
            res.send(results);
        });
    },

    updateUser: (req, res) => {
        const { user_id } = req.params;
        const userData = req.body;

        if (!userData.name || !userData.email) {
            return res.status(400).send('All fields are required for update');
        }

        UserModel.updateUser(user_id, userData, (err, result) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).send('Failed to update user');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('User not found');
            }

            res.send({ message: 'User updated successfully' });
        });
    },

    deleteUser: (req, res) => {
        const { user_id } = req.params;

        UserModel.deleteUser(user_id, (err, result) => {
            if (err) {
                console.error('Error deleting user:', err);
                return res.status(500).send('Failed to delete user');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('User not found');
            }

            res.send({ message: 'User deleted successfully' });
        });
    }
};

export default UserController;
