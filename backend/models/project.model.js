const pool = require('../db/connection');

class ProjectModel {

    constructor() {
    }
    
    async getAll(search = null) {
        let query = 'SELECT id, name, description, owner_id, created_at FROM projects';
        const params = [];

        if(search && search.trim().length > 0){
            query += ' WHERE name ILIKE $1 OR description ILIKE $1 OR owner_id = $2';
            params.push(`%${search}%`);
            const param2 = (isNaN(search)) ? 0 : search;
            params.push(param2);
        }

        const rows = await pool.query(query, params);

        if(rows?.rows?.length > 0){
            return rows.rows;
        }

        return [];
    }

    async getById(id) {
        const rows = await pool.query('SELECT id, name, description, owner_id, created_at FROM projects WHERE id = $1', [id]);

        if(rows?.rows?.length > 0){
            return rows.rows;
        }

        return rows.rows;
    }

    async create(data) {
        const { name, description, owner_id } = data;
        const result = await pool.query('INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING * ', [name, description, owner_id]);
        if (result.rows.length > 0) {
            return result.rows[0];
         }
        return null;
    }

    async update(id, data) {
        const { name, description, owner_id } = data;
        const result = await pool.query('UPDATE projects SET name = $1, description = $2, owner_id = $3 WHERE id = $4 RETURNING *', [name, description, owner_id, id]);
        
        if (result.rows?.length === 1) {
            return result.rows[0];
        }
        return null;
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
        return result.rowCount;
    }
}

module.exports = ProjectModel;