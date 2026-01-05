const pool = require('../db/connection');
const fs = require('fs').promises;
const path = require('path');

class AttachmentsTaskModel{

    constructor(){}

    async getAll(){
        const query = 'SELECT id, owner_id, file_name, file_url, uploaded_at FROM attachments'
        const result = await pool.query(query);
        return result.rows;
    }

    
    async getByTaskId(taskId){
        const query = 'SELECT id, file_name, file_url, uploaded_at FROM attachments WHERE owner_id = $1'
        const result = await pool.query(query, [taskId]);
        return result.rows;
    }


    async getById(id){
        const query = 'SELECT id, owner_id, file_name, file_url, uploaded_at FROM attachments WHERE id = $1'
        const result = await pool.query(query, [id]);
        if (result.rows?.length > 0) {
            return result.rows[0];
        }
        return null;
    }


    async create(data){
        const query = 'INSERT INTO attachments (owner_id, file_name, file_url) VALUES ($1, $2, $3) RETURNING *';
        const { owner_id, file_name, file_url } = data;
        const result = await pool.query(query, [owner_id, file_name, file_url]);
        if (result.rows?.length > 0) {
            return result.rows[0];
        }
        return null;
    }


    async update(id, data){
        const query = 'UPDATE attachments SET owner_id = $1, file_name = $2, file_url = $3 WHERE id = $4 RETURNING *';
        const { owner_id, file_name, file_url } = data;
        const result = await pool.query(query, [owner_id, file_name, file_url, id]);
        if (result.rows?.length > 0) {
            return result.rows[0];
        }
        return null;
    }


    async delete(id){
        const idDeleted = await pool.query('SELECT file_name, file_url FROM attachments WHERE id = $1', [id]);
        if(idDeleted.rows.length === 0){
            return [];
        }
        const query = 'DELETE FROM attachments WHERE id = $1';
        const result = await pool.query(query, [id]);
        if(result.rowCount > 0){
            return idDeleted.rows;
        };
        return [];
    }


    async deleteById(taskId){
        const ids = await pool.query('SELECT file_name, file_url FROM attachments WHERE owner_id = $1', [taskId]);
        if(ids.rows.length === 0){
            return [];
        }
        const query = 'DELETE FROM attachments WHERE owner_id = $1';
        const result = await pool.query(query, [taskId]);
        if(result.rowCount > 0){
            return ids.rows;
        };
        return [];
    }
}

module.exports = AttachmentsTaskModel;