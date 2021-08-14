var express = require('express');
var app = express();
var Permisos = require('../models/permisos');
var mdAuth = require('../middlewares/autenticacion');

/* ====================================================
                    GET permisos
=======================================================*/

app.get('/', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    Permisos.find({}).populate({path: 'roles', model: 'Roles'}).sort({nombre: 1}).exec((err, permisos) => {
        if (err) {
            res.status(500).json({
                ok: true,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                permisos: permisos
            });
        }
    });
});

/* ====================================================
                GET permisos -  check User rol
=======================================================*/

app.get('/pagina:pagina', mdAuth.VerificarToken, (req, res) => {
    const pagina = req.params.pagina;
    const user = req.usuario;
    Permisos.find({pagina: pagina}).populate({path: 'roles', model: 'Roles'}).exec((err, permiso) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            if(permiso.length > 0){
                var user_has_permiso = false;
                for(let rol of permiso[0].roles){
                  if(rol._id == user.rol._id){
                    user_has_permiso = true;
                  }
                }
                if(user_has_permiso == true){
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente',
                        permiso: true
                    });
                }else{
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente',
                        permiso: false
                    });
                }
            }else{
                res.status(500).json({
                    ok: false,
                    mensaje: 'No hay permiso asignado a esa página'
                });
            }
        }
    });
});

/* ====================================================
                    POST Permiso
=======================================================*/
app.post('/', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    var body = req.body;
    var permiso = new Permisos(body);
    permiso.save((err, permisoGuardado) => {
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
                permisoGuardado: permisoGuardado
            });
        }
    });
});

app.put('/', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    Permisos.findById(req.body._id, (err, permiso) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!permiso) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });
        }else{
            permiso.nombre = req.body.nombre;
            permiso.pagina = req.body.pagina;
            permiso.roles = req.body.roles;
            permiso.save((err, permisoActualizado) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Lo sentimos, ocurrió un error',
                        err: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        permisoActualizado: permisoActualizado
                    });
                }
            });
        }
    });
});

app.delete('/:id', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    const id = req.params.id;
    Permisos.findByIdAndRemove(id, (err, permisoEliminado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!permisoEliminado) {
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