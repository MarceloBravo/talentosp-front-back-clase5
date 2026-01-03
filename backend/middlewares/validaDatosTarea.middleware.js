const validaDatosTareaHelper = require("../helpers/validaDatosTareaHelper");


function validaDatosTarea(req, res, next){
    validaDatosTareaHelper(req.body);
  
    next();
}

module.exports = validaDatosTarea;