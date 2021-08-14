var express = require('express');
var app = express();
var Roles = require('../models/roles');
var mdAuth = require('../middlewares/autenticacion');

/* ====================================================
                        GET Roles
=======================================================*/

app.get('/', mdAuth.VerificarToken, (req, res) => {
    Roles.find({}).exec((err, roles) => {
        if (err) {
            res.status(500).json({
                ok: true,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                roles: roles
            });
        }
    });
});

/* ====================================================
                        GET Roles
=======================================================*/

app.get('/onlyName', (req, res) => {
    Roles.find({}, { "estado": 0, "__v":0, _id: 0 }).exec((err, roles) => {
        if (err) {
            res.status(500).json({
                ok: true,
                mensaje: 'Lo sentimos, ocurrió un error',
                error:err
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                roles: roles
            });
        }
    });
});

/* ====================================================
                    POST Rol
=======================================================*/
app.post('/', [mdAuth.VerificarToken], (req, res) => {
    var rol = new Roles({nombre: req.body.nombre});
    rol.save((err, rolGuardado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                rolGuardado: rolGuardado
            });
        }
    });
});

/* ====================================================
                    PUT Rol - nombre
=======================================================*/
app.put('/:id', [mdAuth.VerificarToken], (req, res) => {
    const id = req.params.id;
    Roles.findById(id, (err, rol) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!empresa) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ningún rol',
                err: err
            });
        } else {
            rol.nombre = req.body.nombre;
            rol.save((err, rolActualizado) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Lo sentimos, ocurrió un error',
                        err: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente',
                        rolActualizado: rolActualizado
                    });
                }
            });
        }
    });
});

module.exports = app;