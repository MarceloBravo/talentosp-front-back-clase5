const cnn = require('../db/connection');
const bcrypt = require('bcrypt');

class UsersModel {

    constructor() {
    }

    async getUsersAll(params = []) {
        let query = 'SELECT id, nombre, email, role, activo, created_at, profile_image_url FROM users';
        if(params.length > 0){
            query += ' WHERE nombre ILIKE $1 OR email ILIKE $1';
        }

        const result = await cnn.query(query, params);
        return result.rows;
    }


    async getUserById(id) {
        const result = await cnn.query('SELECT id, nombre, email, role, activo, created_at, profile_image_url FROM users WHERE id = $1', [id]);
        if(result.rows.length > 0){
            return result.rows[0];
        }
        return null;
    }


    async createUser(data) {
        const query = `
            INSERT INTO users (nombre, email, password, role) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, nombre, email, role, activo, created_at`;
            const params = [data.nombre, data.email, data.password, data.role];
            
            const result = await cnn.query(query, params);
        if(result.rows.length > 0){
            return result.rows[0];
        }
        return null;
    }

    async updateUser(id, data) {
        const query = 'UPDATE users SET nombre = $1, email = $2, role = $3, activo = $4 WHERE id = $5 RETURNING *'
        const result = await cnn.query(query, [data.nombre, data.email, data.role, data.activo, id]);
        if(result.rows.length > 0 && data.password.length > 0){
            const result = await cnn.query('UPDATE users SET password = $1 WHERE id = $2 RETURNING *', [data.password, id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        }
        return null;
    }

    async updateUserProfileImage(id, fileUrl) {
        const query = 'UPDATE users SET profile_image_url = $1 WHERE id = $2 RETURNING *';
        const result = await cnn.query(query, [fileUrl, id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    async deleteUser(id) {
        const result = await cnn.query('DELETE FROM users WHERE id = $1', [id]);
        return result.rowCount;
    }

    async login(email) {
        const result = await cnn.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    async refreshToken(id, refreshToken) {
        const result = await cnn.query('SELECT * FROM users WHERE id = $1 AND refresh_token = $2', [id, refreshToken]);
        return result.rows[0];
    }

    async updateRefreshToken(id, refreshToken) {
        const result = await cnn.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, id]);
        return result.rowCount;
    }

    async logout(id) {
        const result = await cnn.query('UPDATE users SET refresh_token = NULL WHERE id = $1', [id]);
        return result.rowCount;
    }
}

module.exports = UsersModel;