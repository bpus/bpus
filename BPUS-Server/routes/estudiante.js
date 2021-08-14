const express = require('express');
const app = express();
const mdAuth = require('../middlewares/autenticacion');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
const Estudiante = require('../models/estudiante');
const excelToJson = require('convert-excel-to-json');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcryptjs');

app.use(fileUpload());

/* ====================================================
                    GET ESTUDIANTES
=======================================================*/

app.get('/',[mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {
    var desde= req.query.desde || 0;
    desde = Number(desde);
    Estudiante.find({programa:req.query.programa}, 'nombres apellidos correo creditos_aprobados codigo identificacion telefono').skip(desde).limit(10).exec((err, estudiantes) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            Estudiante.countDocuments({},(err,conteo)=>{
                if (err) {
                    res.status(500).json({
                        ok: true,
                        mensaje: 'Lo sentimos, ocurrió un error'
                    });
                }else{ 
                    res.status(200).json({
                        ok:true,
                        mensaje: 'Petición realizada correctamente',
                        estudiantes: estudiantes,
                        total:conteo
                    });
                }
            }); 
        }
    });
});

app.get('/buscarEstudiante/:codigo',[mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {
    Estudiante.findOne({codigo:req.params.codigo}).populate('programa').exec((err, estudianteEncotrado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            if (estudianteEncotrado != null) { 
                if(estudianteEncotrado.modalidad){
                    res.status(200).json({
                        ok: false,
                        mensaje: 'El estudiante ya está realizando una modalidad de grado'
                    });
                }else{
                    if(estudianteEncotrado.programa._id.toString() !== req.usuario.programa){
                        res.status(200).json({
                            ok: false,
                            mensaje: 'El estudiante pertenece a otro programa'
                        });
                    }else{
                        estudianteEncotrado.rol = undefined;
                        estudianteEncotrado.contraseña = undefined
                        estudianteEncotrado.usuario = undefined
                        res.status(200).json({
                            ok: true,
                            estudiante: estudianteEncotrado
                        });
                    }
                } 
            }else {
                res.status(200).json({
                    ok: false,
                    mensaje: 'Estudiante no encontrado'
                });
            }
        }
    });
});

app.post('/actualizar', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], async(req, res) => {
    if (req.files.documento_est) {
        // -> Read Excel File to Json Data
        const excelData = excelToJson({
            source: req.files.documento_est.data,
            sheets:[{
                name: 'Hoja1',
                header:{rows: 1},
                columnToKey: {
                    B: 'identificacion',
                    C: 'apellidos',
                    D: 'nombres',
                    E: 'codigo',
                    F: 'creditos_aprobados'
                }
            }]
        });
        const salt = bcrypt.genSaltSync(10);
        for(var i=0; i < excelData.Hoja1.length; i++){
            var estudiante = await Estudiante.find({codigo: excelData.Hoja1[i].codigo});
            if(estudiante.length > 0){
                estudiante[0].identificacion = excelData.Hoja1[i].identificacion;
                estudiante[0].creditos_aprobados = excelData.Hoja1[i].creditos_aprobados;
                await estudiante[0].save();
            }else{
                var pass = excelData.Hoja1[i].identificacion.toString();
                var hash = bcrypt.hashSync(pass, salt);
                var estudianteNuevo = new Estudiante({
                    codigo: excelData.Hoja1[i].codigo,
                    identificacion: excelData.Hoja1[i].identificacion,
                    nombres: excelData.Hoja1[i].nombres,
                    apellidos: excelData.Hoja1[i].apellidos,
                    correo: 'u'+excelData.Hoja1[i].codigo+'@usco.edu.co',
                    programa: req.query.programa,
                    creditos_aprobados: excelData.Hoja1[i].creditos_aprobados,
                    usuario: 'u'+excelData.Hoja1[i].codigo,
                    contraseña: hash,
                    rol: '60ae71d8523f541fcc578269'
                });
                await estudianteNuevo.save();
            }
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Petición realizada correctamente'
        });
    }else{
        res.status(500).json({
            ok: false,
            mensaje: 'Lo sentimos, ocurrió un error',
            err: error
        });
    }
});

app.put('/cambiarclave', [mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {
    Estudiante.findById(req.usuario._id, (err, estudiante) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!estudiante) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });
        }else{
            const salt = bcrypt.genSaltSync(10);
            const pass = req.body.clave;
            const hash = bcrypt.hashSync(pass, salt);
            estudiante.contraseña = hash
            estudiante.save((err, estudianteSave) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Lo sentimos, ocurrió un error',
                        err: err
                    });
                } else {
                    delete req.usuario.password;
                    var token = jwt.sign({usuario: req.usuario},SEED,{expiresIn:'1h'}); // 1 hora y luego expirara el token.
                    res.status(200).json({
                        ok: true,
                        token:token
                    });
                }
            });
        }
    });
});

app.put('/telefono', mdAuth.VerificarToken, (req,res) => {
    if(req.body.usuario === req.usuario._id){
        Estudiante.findById(req.body.usuario, (err, estudiante) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ocurrió un error',
                    err: err
                });
            } else if (!estudiante) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontró ninguna solicitud',
                    err: err
                });
            }else{
                estudiante.telefono = req.body.telefono;
                estudiante.save((err, estudianteSave) => {
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Lo sentimos, ocurrió un error',
                            err: err
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
        res.status(500).json({
            ok: false,
            mensaje: 'Usted no puede hacer esto!',
            err: err
        });
    }
});

module.exports = app;