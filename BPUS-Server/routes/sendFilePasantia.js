var express = require('express');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var fileSystem = require('fs');
var path = require('path');

var app = express();


app.get('/:idEstudiante/:file', (req, res) => {

    try{
        var token = req.query.token;
        // Verificamos el token
        jwt.verify(token, SEED, (err, decoded) => {
            // Si hay error...
            if (err) {
                console.log(err)
                res.status(500).json({
                    ok: false,
                    mensaje: 'Token no válido'
                });
            } else {
                req.usuario = decoded.usuario;
                var id_estudiante = req.params.idEstudiante;
                var file = req.params.file;

                var pathFile = path.resolve(__dirname, `../uploads/documents/pasantia/${id_estudiante}/${file}`);

                if (fileSystem.existsSync(pathFile)) {
                    res.sendFile(pathFile);

                } else {
                    var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
                    res.sendFile(pathNoImage);
                }
            }
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            ok: false,
            mensaje: 'Token no válido',
            err: error
        });
    }

});

module.exports = app;