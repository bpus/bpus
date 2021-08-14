var express = require('express');
var app = express();
var Convenio = require('../models/Convenio');
var mdAuth = require('../middlewares/autenticacion');

/* ====================================================
            GET Convenio - jefe de programa
=======================================================*/

app.get('/programa:programa', mdAuth.VerificarToken, (req, res) => {

    var programa = req.params.programa;
    Convenio.find({programa: programa}).populate('programa').populate('empresa').populate('encargado').exec((err, convenios) => {
        if (err) {
            res.status(500).json({
                ok: true,
                mensaje: 'Lo sentimos, ocurrió un error'
            });

        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                convenios: convenios
            });
        }
    });
});

/* ====================================================
            GET Convenio - admin
=======================================================*/

app.get('/', mdAuth.VerificarToken, (req, res) => {
    var desde= req.query.desde || 0;
    desde = Number(desde);
    Convenio.find({}).limit(10).skip(desde)
    .populate('programa')
    .populate('empresa')
    .populate('encargado').exec((err, convenios) => {
            if (err) {
                res.status(500).json({
                    ok: true,
                    mensaje: 'Lo sentimos, ocurrió un error'
                });

            } else {
                Convenio.count({},(err,conteo)=>{
                    if (err) {
                        res.status(500).json({
                            ok: true,
                            mensaje: 'Lo sentimos, ocurrió un error'
                        });
                    }else{ 
                        res.status(200).json({
                            ok:true,
                            mensaje: 'Petición realizada correctamente',
                            convenios: convenios,
                            total:conteo
                        });
                    }
                }); 
            }
        });
});

/* ====================================================
            GET Convenio - Encargado
=======================================================*/

app.get('/encargado:encargado', mdAuth.VerificarToken, (req, res) => {
    const encargado = req.params.encargado;
    Convenio.find({encargado: encargado}).populate('programa').populate('empresa').exec((err, convenio) => {
        if (err) {
            res.status(500).json({
                ok: true,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                convenio: convenio[0]
            });
        }
    });
});


/* ====================================================
                    POST Convenio
=======================================================*/
app.post('/', [mdAuth.VerificarToken], (req, res) => {

    var body = req.body;
    var convenio = new Convenio({
        empresa: body.empresa,
        programa: body.programa,
        encargado: body.encargadoEmpresa,
        rutapdf: '',
        estado: 'Activo'
    });

    convenio.save((err, convenioGuardado) => {

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
                convenioGuardado: convenioGuardado
            });
        }
    });

});

module.exports = app;