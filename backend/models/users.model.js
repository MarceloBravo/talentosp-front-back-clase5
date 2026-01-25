const cnn = require('../db/connection');
const bcrypt = require('bcryptjs');

class UsersModel {

    constructor() {
    }

    async getUsersAll(params = []) {
        let query = 'SELECT id, nombre, email, role, activo, created_at, file_url FROM users';
        if(params.length > 0){
            query += ' WHERE nombre ILIKE $1 OR email ILIKE $1';
        }

        const result = await cnn.query(query, params);
        return result.rows;
    }


    async getUserById(id) {
        const result = await cnn.query('SELECT id, nombre, email, role, activo, created_at, file_url FROM users WHERE id = $1', [id]);
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
            if(data.file_url){
                await this.updateUserProfileImage(result.rows[0].id, data.file_url);
            }
            return result.rows[0];
        }
        return null;
    }

    async updateUser(id, data) {
        const query = 'UPDATE users SET nombre = $1, email = $2, role = $3, activo = $4 WHERE id = $5 RETURNING *';
        const result = await cnn.query(query, [data.nombre, data.email, data.role, data.activo, id]);

        if(data.file_url && result.rows.length > 0){
            await this.updateUserProfileImage(id, data.file_url);
        }

        if (result.rows.length > 0) {
            const updatedUser = result.rows[0];

            // Si se proporcionó una nueva contraseña, actualizarla también
            if (data.password && data.password.length > 0) {
                const passwordUpdateResult = await cnn.query('UPDATE users SET password = $1 WHERE id = $2 RETURNING *', [data.password, id]);
                return passwordUpdateResult.rows.length > 0 ? passwordUpdateResult.rows[0] : null;
            }

            return updatedUser; // Devuelve el usuario actualizado si no se cambió la contraseña
        }

        return null; // Devuelve null si el usuario no se encontró o la actualización falló
    }

    async updateUserProfileImage(id, fileUrl) {
        const query = 'UPDATE users SET file_url = $1 WHERE id = $2 RETURNING *';
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