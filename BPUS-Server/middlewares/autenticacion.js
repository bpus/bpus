var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


// Exportamos la función VerificarToken que autentica el usuario validando el token 
module.exports.VerificarToken = function (req, res, next) {

    try{
        // Obtenemos el token de la url
        var tokenArray = req.headers.authorization.split(" ");
        var token = tokenArray[1];

        // Verificamos el token
        jwt.verify(token, SEED, (err, decoded) => {
            // Si hay error...
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Token no válido'
                });
            } else {
                // Si es válido, lo dejamos pasar
                req.usuario = decoded.usuario;
                next();
            }
        });
    }catch(error){
        res.status(500).json({
            ok: false,
            mensaje: 'Token no válido',
            err: error
        });
    }
}

module.exports.VerificarEstudiante = function (req, res, next) {

    var user = req.usuario;
    if (user.rol.nombre  == "ESTUDIANTE") {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            mensaje: "Usted no puede hacer eso"
        });
    }
}

module.exports.VerificarDirector = function (req, res, next) {

    var user = req.usuario;
    if (user.rol.nombre == "JEFE_PROGRAMA" || user.rol.nombre  == "PROFESOR") {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            mensaje: "Usted no puede hacer eso"
        });
    }
}

module.exports.VerificarJefePrograma = function (req, res, next) {

    var user = req.usuario;
    if (user.rol.nombre == "JEFE_PROGRAMA") {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            mensaje: "Usted no puede hacer eso"
        });
    }
}

module.exports.VerificarEncargado = function (req, res, next) {

    var user = req.usuario;
    if (user.rol.nombre  == "ENCARGADO_EMPRESA") {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            mensaje: "Usted no puede hacer eso"
        });
    }
}

module.exports.VerifyTutor = function (req, res, next) {

    var user = req.usuario;
    if (user.rol.nombre  == "PROFESOR") {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            mensaje: "Usted no puede hacer eso"
        });
    }
}

module.exports.VerifyAdmin = function (req, res, next) {

    var user = req.usuario;
    if (user.rol.nombre  == "ADMIN") {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            mensaje: "Usted no puede hacer eso"
        });
    }
}