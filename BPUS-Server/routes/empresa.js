var express = require('express');
var app = express();
var Empresa = require('../models/Empresa');
var mdAuth = require('../middlewares/autenticacion');


/* ====================================================
                    GET EMPRESAS
=======================================================*/

app.get('/', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    Empresa.find({}).exec((err, empresas) => {
        if (err) {
            res.status(500).json({
                ok: true,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                empresas: empresas
            });
        }
    });
});

/* ====================================================
                    POST EMPRESAS
=======================================================*/
app.post('/', [mdAuth.VerificarToken], (req, res) => {
    if(req.usuario.rol.nombre === "JEFE_PROGRAMA" || req.usuario.rol.nombre === "ADMIN"){
        var body = req.body;
        var empresa = new Empresa({
            nit: body.nit,
            nombre: body.nombre,
            ciudad: body.ciudad,
            direccion: body.direccion,
            telefono: body.telefono,
            naturaleza: body.naturaleza,
            actividad_economica: body.actividad_economica,
            estado: true
        });
        empresa.save((err, empresaGuardada) => {
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
                    empresaGuardada: empresaGuardada
                });
            }
        });
    }
});

/* ====================================================
                    PUT EMPRESAS
=======================================================*/
app.put('/:id', [mdAuth.VerificarToken], (req, res) => {
    if(req.usuario.rol.nombre === "JEFE_PROGRAMA" || req.usuario.rol.nombre === "ADMIN"){
        var body = req.body;
        var id = req.params.id;
        Empresa.findById(id, (err, empresa) => {
            if (err) {
                res.status(500).json({
    
                    ok: false,
                    mensaje: 'Lo sentimos, ocurrió un error',
                    err: err
                });
            } else if (!empresa) {
                res.status(400).json({
    
                    ok: false,
                    mensaje: 'No se encontró ninguna empresa',
                    err: err
                });
            } else {
                empresa.nit = body.nit;
                empresa.nombre = body.nombre;
                empresa.ciudad = body.ciudad;
                empresa.direccion = body.direccion;
                empresa.telefono = body.telefono;
                empresa.naturaleza = body.naturaleza;
                empresa.actividad_economica = body.actividad_economica;
                empresa.estado = body.estado;
    
                empresa.save((err, empresaActualizada) => {
    
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
                            empresaActualizada: empresaActualizada
                        });
                    }
                });
            }
        });
    }
});

/* ====================================================
                    DELETE EMPRESAS
=======================================================*/
app.delete('/:id', [mdAuth.VerificarToken], (req, res) => {
    if(req.usuario.rol.nombre === "JEFE_PROGRAMA" || req.usuario.rol.nombre === "ADMIN"){
        var id = req.params.id;
        Empresa.findByIdAndRemove(id, (err, empresaEliminada) => {
    
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ocurrió un error',
                    err: err
                });
            } else if (!empresaEliminada) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontró ninguna empresa',
                    err: err
                });
            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    empresaEliminada: empresaEliminada
                });
            }
        });
    }
});

module.exports = app;