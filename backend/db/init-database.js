// NOTA: Este script requiere los paquetes 'pg' y 'dotenv'.
// Asegúrate de instalarlos ejecutando: npm install pg dotenv
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: false,
};

const dbName = process.env.DB_NAME || 'taskflow';

async function executeSqlFile() {
    console.log('Using database configuration:', dbConfig); // Debugging line
    console.log('Leyendo el archivo database.sql...');
    const sqlFilePath = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Divide el script en sentencias individuales y filtra las que no son para PostgreSQL
    const statements = sql.split(/;\s*$/m)
        .map(st => st.trim())
        .filter(st => st && !st.toLowerCase().startsWith('use taskflow'));
    
    const createDbStatement = statements.find(st => st.toLowerCase().startsWith('create database'));
    const otherStatements = statements.filter(st => !st.toLowerCase().startsWith('create database'));

    // --- Paso 1: Conectarse al servidor PostgreSQL para crear la base de datos ---
    const adminClient = new Client({ ...dbConfig, database: 'postgres' });
    try {
        await adminClient.connect();
        console.log('Conectado al servidor PostgreSQL (base de datos "postgres").');

        const res = await adminClient.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        if (res.rowCount === 0) {
            console.log(`La base de datos "${dbName}" no existe, se procederá a crearla...`);
            if (createDbStatement) {
                // Usamos la sentencia del archivo SQL, pero sin "IF NOT EXISTS" que no es estandar en todas las versiones de PG
                const cleanCreateDbStatement = createDbStatement.replace(/if not exists/i, '').trim();
                await adminClient.query(cleanCreateDbStatement);
                console.log(`Base de datos "${dbName}" creada con éxito.`);
            } else {
                // Fallback por si no está en el archivo
                await adminClient.query(`CREATE DATABASE ${dbName}`);
                console.log(`Base de datos "${dbName}" creada con éxito.`);
            }
        } else {
            console.log(`La base de datos "${dbName}" ya existe. Saltando creación.`);
        }
    } catch (error) {
        console.error('Error al crear la base de datos:', error);
        process.exit(1); // Salir si no se puede crear la DB
    } finally {
        await adminClient.end();
    }

    // --- Paso 2: Conectarse a la nueva base de datos para ejecutar el resto de sentencias ---
    const appClient = new Client({ ...dbConfig, database: dbName });
    try {
        await appClient.connect();
        console.log(`Conectado a la base de datos "${dbName}".`);
        console.log('Ejecutando sentencias para crear tablas, tipos e insertar datos...');
        
        for (const statement of otherStatements) {
            if (statement) { // Asegurarse de que no está vacío
                console.log(`Ejecutando: ${statement.substring(0, 50)}...`);
                await appClient.query(statement);
            }
        }
        
        console.log('¡Script de base de datos ejecutado correctamente!');
    } catch (error) {
        console.error('Error al ejecutar las sentencias SQL:', error);
    } finally {
        await appClient.end();
        console.log('Conexión finalizada.');
    }
}

executeSqlFile();