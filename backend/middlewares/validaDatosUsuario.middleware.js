function validaDatosUsuario(req, res, next){
    const {nombre, role, email, password, activo} = req.body;
    if(
        !nombre || 
        !email || 
        !role || 
        nombre.trim().length === 0 || 
        role.trim().length === 0 || 
        email.trim().length === 0 || 
        activo === undefined || 
        activo === null ||  
        ((!password || password.trim().length === 0) && req.method === 'POST') //Sólo es obligatorio al crear el usuario
    ){
        return res.status(400).json({
            status: 'error',
            message: 'Datos incompletos. Todos los campos son obligatorios.'
        });
    }
    next();
}

module.exports = validaDatosUsuario;