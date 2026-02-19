
USE taskflow;

-- Creación de Tipos para Roles y Prioridades
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('todo', 'in-progress', 'completed');

-- 1. Tabla de Usuarios (Soporta Auth JWT y Refresh Tokens)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    refresh_token TEXT,
    activo BOOLEAN DEFAULT true,
    file_url VARCHAR(255), -- Ruta del archivo avatar
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Projects
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, 
    description TEXT,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Tareas (Incluye estados y asignados)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE, 
    title VARCHAR(200) NOT NULL, 
    description TEXT,
    status task_status DEFAULT 'todo', 
    priority task_priority DEFAULT 'medium', 
    assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL, 
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Adjuntos (Gestión de Archivos)
CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Adjuntos para proyectos (Gestión de Archivos)
CREATE TABLE attachments_project (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar Usuarios (Nota: Passwords deberían estar hasheados con bcrypt en la app real)
INSERT INTO users (nombre, email, password, role) VALUES 
('Admin TaskFlow', 'admin@taskflow.ai', '$2b$10$qNFBadI7qUXNq.AphV3MDe2ClhApt/sUv0/9nrgwlcgh3imclDNp2', 'admin'), -- pwd = 123123
('Juan Desarrollador', 'juan@talentops.ai', '$2b$10$N5T/ZY3RbHSKmsHjMtA8HepxiSNztZFZK4dhv.zAACjmAUrP4x30O', 'user'); -- pwd = 123456

-- Insertar un Project
INSERT INTO projects (name, description, owner_id) VALUES 
('Despliegue TaskFlow', 'Project final de integración Full-Stack', 1);

-- Insertar Tareas para el Dashboard
INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date) VALUES 
(1, 'Configurar Docker Compose', 'Crear archivos para backend y frontend', 'completed', 'high', 1, '2025-12-30'),
(1, 'Implementar Auth JWT', 'Registro, login y refresh tokens', 'in-progress', 'high', 2, '2025-12-31'), 
(1, 'Crear Dashboard de Métricas', 'Visualización de tareas y estados globales', 'todo', 'medium', 2, '2026-01-05');

-- Insertar un Adjunto de prueba
INSERT INTO attachments (owner_id, file_name, file_url) VALUES 
(1, 'docker-config-diagram.png', 'https://storage.taskflow.ai/attachments/d1.png');

