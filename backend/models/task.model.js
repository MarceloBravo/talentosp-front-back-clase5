const pool = require('../db/connection');

class TaskModel {

    constructor(){
        
    }
    
    async getAll(search = null) {
        let query = 'SELECT id, project_id, title, description, status, priority, assignee_id, due_date, created_at FROM tasks'
        const params = [];

        if(search && search.trim().length > 0){
            query += ' WHERE title ILIKE $1 OR description ILIKE $1 OR status ILIKE $1 OR priority ILIKE $1 OR assignee_id ILIKE $1 OR due_date ILIKE $1';
            params.push(`%${search}%`);
        }

        const rows = await pool.query(query, params);
        return rows;
    }

    async getAllTasksByProjectId(projectId) {
        let query = 'SELECT id, project_id, title, description, status, priority, assignee_id, due_date, created_at FROM tasks WHERE project_id = $1';
        const rows = await pool.query(query, [projectId]);
        return rows;
    }

    async getById(id) {
        const rows = await pool.query('SELECT id, project_id, title, description, status, priority, assignee_id, due_date, created_at FROM tasks WHERE id = $1', [id]);

        if(rows.rows?.length > 0){
            return rows.rows[0];
        }
        return null;
    }

    async create(data) {
        const { project_id, title, description, status, priority, assignee_id, due_date } = data;
        const result = await pool.query(
            'INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [project_id, title, description, status, priority, assignee_id, due_date]
        );
        if (result.rows?.length > 0) {
            return result.rows[0];
        }
        return null;
    }

    async update(id, data) {
        const { title, description, status, priority, assignee_id, due_date } = data;
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, assignee_id = $5, due_date = $6 WHERE id = $7 RETURNING *',
            [title, description, status, priority, assignee_id, due_date, id]
        );
        
        if (result.rows?.length === 1) {
            return result.rows[0];
        }
        return null;
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        return result.rowCount ?? 0;
    }

    async deleteByProjectId(projectId) {
        const result = await pool.query('DELETE FROM tasks WHERE project_id = $1', [projectId]);
        return result.rowCount;
    }
}

module.exports = TaskModel;