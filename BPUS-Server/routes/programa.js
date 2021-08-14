var express = require('express');
var app = express();

// Importamos el modelo de los programas
var Programa = require('../models/programa');
var Administrativo = require('../models/administrativo');
var mdAuth = require('../middlewares/autenticacion');

app.get('/', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    var desde= req.query.desde || 0;
    desde = Number(desde);
    Programa.find({}).limit(10).skip(desde).populate({path: 'jefe', select: 'nombres apellidos correo'}).sort({nombre: 1}).exec((err, programas) => {
        if (err) {
            res.status(500).json({
                ok: true,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            Programa.countDocuments({},(err,conteo)=>{
                if (err) {
                    res.status(500).json({
                        ok: true,
                        mensaje: 'Lo sentimos, ocurrió un error'
                    });
                }else{ 
                    res.status(200).json({
                        ok:true,
                        mensaje: 'Petición realizada correctamente',
                        programas: programas,
                        total:conteo
                    });
                }
            }); 
        }
    });
});

app.get('/todos', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    Programa.find({}).exec((err, programas) => {
        if (err) {
            res.status(500).json({
                ok: true,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        }else {
            if (err) {
                res.status(500).json({
                    ok: true,
                    mensaje: 'Lo sentimos, ocurrió un error'
                });
            }else{ 
                res.status(200).json({
                    ok:true,
                    mensaje: 'Petición realizada correctamente',
                    programas: programas
                });
            }
        }
    });
});

app.get('/programaEstudiante', mdAuth.VerificarToken, (req, res) => {
    Programa.findById(req.usuario.programa).populate({path: 'jefe', select: 'nombres apellidos correo'}).exec((err, programa)=> { 
        // Si hay un error...
        if (err) {
            res.status(500).json({

                ok: false,
                mensaje: 'Lo sentimos, hubo un error',
                error: err
            });
        } else {
            // Si todo sale bien, retornamos lo que encontró
            res.status(200).json({
                ok: true,
                programa: programa
            });
        }
    });
});

app.post('/', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    const programa = new Programa(req.body);
    programa.save((err, programaGuardado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else {
            Administrativo.findByIdAndUpdate(req.body.jefe, {programa: programaGuardado._id, rol: "60ae76ea523f541fcc57826a"}, (err, adminAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al cambiar el rol del docente",
                        error: err
                    });
                }else if(!adminAct){
                    res.status(500).json({
                        ok: false,
                        mensaje: "No se encontro a ningún admin",
                        error: err
                    });
                }else{
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente'
                    });
                }
            });
        }
    });
});

app.put('/:id', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    Programa.findById(req.params.id, (err, programa) =>{
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        }else if(!programa){ 
            res.status(500).json({
                ok: false,
                mensaje: "No se encontro a ningún programa",
            });
        }else {
            const jefeOld = programa.jefe;
            programa.jefe = req.body.jefe;
            programa.nombre = req.body.nombre;
            programa.creditos_totales = req.body.creditos_totales;
            programa.save((error,programaEditado) =>{
                if(error){
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Lo sentimos, ocurrió un error',
                        err: err
                    });
                }else{
                    if(req.body.jefe !== jefeOld){
                        Administrativo.findByIdAndUpdate(req.body.jefe, {programa: programa._id, rol: "60ae76ea523f541fcc57826a"}, (err, adminAct) => {
                            if (err) {
                                res.status(500).json({
                                    ok: false,
                                    mensaje: "Lo sentimos, hubo un error al cambiar el rol del docente",
                                    error: err
                                });
                            }else if(!adminAct){
                                res.status(500).json({
                                    ok: false,
                                    mensaje: "No se encontro a ningún admin",
                                });
                            }else{
                                Administrativo.findByIdAndUpdate(jefeOld, {rol: "60b3b095da08a53d0925e9dc"}, (errr, adminAct2) => {
                                    if (errr) {
                                        res.status(500).json({
                                            ok: false,
                                            mensaje: "Lo sentimos, hubo un error al cambiar el rol del docente",
                                            error: errr
                                        });
                                    }else if(!adminAct2){
                                        res.status(500).json({
                                            ok: false,
                                            mensaje: "No se encontro a ningún admin",
                                        });
                                    }else{
                                        res.status(200).json({
                                            ok: true,
                                            mensaje: 'Petición realizada correctamente'
                                        });
                                    }
                                });
                            }
                        });
                    }else{
                        res.status(200).json({
                            ok: true,
                            mensaje: 'Petición realizada correctamente'
                        });
                    }
                }
            });
        }
    });
});

app.delete('/:id', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {        
    Programa.findByIdAndRemove(req.params.id, (err, programaEliminado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!programaEliminado) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ningun programa',
                err: err
            });
        } else {
            Administrativo.findByIdAndUpdate(programaEliminado.jefe, {programa: undefined, rol: "60b3b095da08a53d0925e9dc"}, (err, adminAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al cambiar el rol del docente",
                        error: err
                    });
                }else if(!adminAct){
                    res.status(500).json({
                        ok: false,
                        mensaje: "No se encontro a ningún admin",
                        error: err
                    });
                }else{
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente'
                    });
                }
            });
        }
    });
});

module.exports = app;