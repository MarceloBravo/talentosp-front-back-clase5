function validaDatosProject(req, res, next) {
    const contentType = req.headers["content-type"]
    const project = contentType.includes("multipart/form-data") ? req.body : JSON.parse(req.body);
    const {
        name,
        description,
        owner_id
    } = project;

    
    if (!name || name.trim().length === 0 ){
        return res.status(400).json({ status: 'error', message: 'El nombre del project es obligatorio.' });
    }
    if (name.trim().length > 100) {
        return res.status(400).json({ status: 'error', message: 'El nombre del project debe tener como máximo 100 caracteres.' });
    }
    if (!description || description.trim().length === 0 ){
        return res.status(400).json({ status: 'error', message: 'La descripción del proyecto es obligatoria.' });
    }
    if (!owner_id || isNaN(owner_id) || parseInt(owner_id) <= 0 || owner_id - parseInt(owner_id) !== 0) {
        return res.status(400).json({ status: 'error', message: 'El usuario a quien asignar el proyecto no es válido' });
    }
    
    next();
}
module.exports = validaDatosProject;