var express = require('express');
var fileSystem = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();


app.get('/:idProyecto/:file', (req, res) => {

    try{
        var token = req.query.token;
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
                var idProyecto = req.params.idProyecto;
                var file = req.params.file;
            
                var pathFile = path.resolve(__dirname, `../uploads/documents/proyectos/${idProyecto}/${file}`);
            
                if (fileSystem.existsSync(pathFile)) {
                    res.sendFile(pathFile);
            
                } else {
                    var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
                    res.sendFile(pathNoImage);
                }
            }
        });
    }catch(error){
        res.status(500).json({
            ok: false,
            mensaje: 'Token no válido',
            err: error
        });
    }

});

module.exports = app;