var express = require('express');
var app = express();

// Importamos el modelo de la modalidad
var Modalidad = require('../models/modalidad');

// Importamos el middleware de auth
var mdAuth = require('../middlewares/autenticacion');


app.get('/', mdAuth.VerificarToken, (req, res) => {

    // Buscamos todas las modalidades
    Modalidad.find({}, (err, modalidades) => {
        // Si hay un error...
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, hubo un error'
            });
        } else {
            // Si todo sale bien...
            res.status(200).json({
                ok: true,
                modalidades: modalidades
            });
        }
    });
});
/* ====================================================
                    check Modalidad
=======================================================*/
app.get('/:id', mdAuth.VerificarToken, (req, res) => {
    Modalidad.findById(req.params.id).exec((err, modalidad) => { 
        // Si hay un error...
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, hubo un error'
            });
        } else {
            res.status(200).json({
                ok: true,
                modalidad: modalidad
            });
        }
    });
});
/* ====================================================
                    POST Modalidad
=======================================================*/
app.post('/', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req,res) => {
    const modalidad = new Modalidad(req.body);
    modalidad.save((err, modalidadGuardada) => {
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
            });
        }
    });
});

/* ====================================================
                    PUT Modalidad
=======================================================*/
app.put('/', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {

    Modalidad.findById(req.body._id, (err, modalidad) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!modalidad) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna vacante',
                err: err
            });

        } else {

            modalidad.nombre = req.body.nombre;
            modalidad.porcentaje_creditos = req.body.porcentaje_creditos;
            modalidad.url = req.body.url;

            modalidad.save((err, modalidadActualizada) => {

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
                    });
                }
            });
        }
    });

});

/* ====================================================
                    DELETE Modalidad
=======================================================*/
app.delete('/:id', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {

    const id = req.params.id;

    Modalidad.findByIdAndRemove(id, (err, modalidadEliminada) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!modalidadEliminada) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna vacante',
                err: err
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
            });
        }
    });
});


module.exports = app;