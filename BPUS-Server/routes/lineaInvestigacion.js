const express = require('express');
const app = express();
const LineaInvestigacion = require('../models/lineaInvestigacion');
const mdAuth = require('../middlewares/autenticacion');

app.get('/todas', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    LineaInvestigacion.find({}).populate({path:'programa', select: 'nombre'}).exec((err,lineasInvestigacion) => {
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, hubo un error',
                err: err
            });
        }else{
            res.status(200).json({
                ok: true,
                lineasInvestigacion: lineasInvestigacion
            });
        }
    });
});

app.get('/jefe/:programa', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {
    LineaInvestigacion.find({programa: req.params.programa}, (err,lineasInvestigacion) => {
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, hubo un error',
                err: err
            });
        }else{
            res.status(200).json({
                ok: true,
                lineasInvestigacion: lineasInvestigacion
            });
        }
    });
});


app.get('/estudiante/:programa', [mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {
    LineaInvestigacion.find({programa: req.params.programa, estado: true}, (err,lineasInvestigacion) => {
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, hubo un error',
                err: err
            });
        }else{
            res.status(200).json({
                ok: true,
                lineasInvestigacion: lineasInvestigacion
            });
        }
    });
});

app.post('/', [mdAuth.VerificarToken], (req,res) => {
    if(req.usuario.rol.nombre === "JEFE_PROGRAMA" || req.usuario.rol.nombre === "ADMIN"){
        const linea = new LineaInvestigacion(req.body);
        linea.save((err, lineaGuardada) => {
            if(err){
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, hubo un error',
                    err: err
                });
            }else{
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente'
                });
            }
        });
    }else{
        res.status(403).json({
            ok: false,
            mensaje: "Usted no puede hacer eso"
        });
    }
});

app.put('/:id', [mdAuth.VerificarToken], (req,res) => {
    if(req.usuario.rol.nombre === "JEFE_PROGRAMA" || req.usuario.rol.nombre === "ADMIN"){
        LineaInvestigacion.findByIdAndUpdate(req.params.id, req.body, (err,lineaActualizada) => {
            if(err){
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, hubo un error',
                    err: err
                });
            }else if(!lineaActualizada){
                res.status(500).json({
                    ok: false,
                    mensaje: 'No se encontro ninguna linea de investigacion',
                });
            }else{
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                });
            }
        });
    }else{
        res.status(403).json({
            ok: false,
            mensaje: "Usted no puede hacer eso"
        });
    }
});

app.delete('/:id', [mdAuth.VerificarToken], (req,res) => {
    if(req.usuario.rol.nombre === "JEFE_PROGRAMA" || req.usuario.rol.nombre === "ADMIN"){
        LineaInvestigacion.findByIdAndDelete(req.params.id, (err, lineaborrada) => {
            if(err){
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, hubo un error',
                    err: err
                });
            }else if(!lineaborrada){
                res.status(500).json({
                    ok: false,
                    mensaje: 'No se encontro ninguna linea de investigacion',
                });
            }else{
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                });
            }
        });
    }else{
        res.status(403).json({
            ok: false,
            mensaje: "Usted no puede hacer eso"
        });
    }
});

module.exports = app;