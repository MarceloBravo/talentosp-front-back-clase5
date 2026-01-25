const bcrypt = require('bcryptjs');

async function parseUserData(req, res, next){
    const { nombre, email, password, role, activo } = req.body;

    if(nombre){
        req.body.nombre = `${nombre}`;
    }

    if(email){
        req.body.email = `${email}`;
    }

    if(password){
        const saltRounds = process.env.SALTROUNDS || '10';
        const hashedPassword = await bcrypt.hash(password, parseInt(saltRounds));
        req.body.password = `${hashedPassword}`;
    }

    if(role){
        req.body.role = `${role}`;
    }

    if(typeof activo === 'boolean'){
        req.body.activo = activo;
    }
    if(typeof activo === 'string' && (activo === 'true' || activo === 'false')){
        req.body.activo = activo === 'true' ? true : false;
    }

    next();
}

module.exports = parseUserData;