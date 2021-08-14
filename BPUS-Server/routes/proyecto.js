var express = require('express');
var app = express();
var Proyecto = require('../models/proyecto');
var Estudiante = require('../models/estudiante');
var mdAuth = require('../middlewares/autenticacion');

//=====================================================
//               POST-Proyecto
//=====================================================
app.post('/', [mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {

    var proyecto = new Proyecto(req.body);
    proyecto.estado = "Enviado"; 
    if(proyecto.estudiante2){
        proyecto.aprobacionEstudiante2 = false;
        proyecto.estado = "Pendiente"; 
    }
    if(proyecto.estudiante3){
        proyecto.aprobacionEstudiante3 = false;
    }

    proyecto.save((err, solicitudGuardada) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ha ocurrido un error',
                err: err
            });
        } else {
            Estudiante.findById(req.body.estudiante, (err, estudiante) => {            
                estudiante.modalidad = solicitudGuardada._id;
                estudiante.onModel = 'Proyecto';
                estudiante.save((err, estudianteSave) => {
                    if(err){
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Lo sentimos, ocurrió un error',
                            err: error
                        });
                    }else if(req.body.estudiante2){
                        estudianteSave.rol = undefined;
                        estudianteSave.contraseña = undefined;
                        estudianteSave.usuario = undefined;
                        Estudiante.findById(req.body.estudiante2, (err, estudiante2) => {            
                            estudiante2.modalidad = solicitudGuardada._id;
                            estudiante2.onModel = 'Proyecto';
                            estudiante2.save((err, estudianteSave2) => {
                                if(err){
                                    res.status(500).json({
                                        ok: false,
                                        mensaje: 'Lo sentimos, ocurrió un error',
                                        err: error
                                    });
                                }else if(req.body.estudiante3){
                                    Estudiante.findById(req.body.estudiante3, (err, estudiante3) => {            
                                        estudiante3.modalidad = solicitudGuardada._id;
                                        estudiante3.onModel = 'Proyecto';
                                        estudiante3.save((err, estudianteSave3) => {
                                            if(err){
                                                res.status(500).json({
                                                    ok: false,
                                                    mensaje: 'Lo sentimos, ocurrió un error',
                                                    err: error
                                                });
                                            }else{
                                                res.status(200).json({
                                                    ok: true,
                                                    mensaje: 'Petición realizada correctamente',
                                                    solicitudGuardada: solicitudGuardada,
                                                    estudianteSave: estudianteSave
                                                });
                                            }
                                        });
                                    });
                                }else{
                                    res.status(200).json({
                                        ok: true,
                                        mensaje: 'Petición realizada correctamente',
                                        solicitudGuardada: solicitudGuardada,
                                        estudianteSave: estudianteSave
                                    });
                                }
                            });
                        });
                    }else{
                        estudianteSave.rol = undefined;
                        estudianteSave.contraseña = undefined;
                        estudianteSave.usuario = undefined;
                        res.status(200).json({
                            ok: true,
                            mensaje: 'Petición realizada correctamente',
                            solicitudGuardada: solicitudGuardada,
                            estudianteSave: estudianteSave
                        });
                    }
                });
            });
        }
    });
});
//=====================================================
//       GET-Proyectos enviados - por programa 
//=====================================================
app.get('/porPrograma/:programa', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {
    Proyecto.find({estado: 'Enviado', programa: req.params.programa})
        .populate({
            path:'estudiante estudiante2 estudiante3 director',
            select:'nombres apellidos correo creditos_aprobados codigo identificacion telefono'})
        .populate({path:'lineaInvestigacion', select:'nombre'})
        .exec((err, proyectos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error',
                    err: err
                });
            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    proyectos: proyectos
                });
            }
        });
});
//=====================================================
//            GET-Proyecto- por id
//=====================================================
app.get('/estudiante/:id', [mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {
    const id = req.params.id;
    Proyecto.findById(id)
        .populate({ path: 'estudiante estudiante2 estudiante3 director jurado1 jurado2', select:'nombres apellidos correo'})
        .populate({path:'lineaInvestigacion', select:'nombre'})
        .exec((err, proyecto) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error',
                    err: err
                });
            } else if (!proyecto) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, no se encontró su solicitud',
                })
            } else {
                const user = req.usuario;
                if(user._id === proyecto.estudiante._id){
                    proyecto.estudiante = undefined;
                }else if(proyecto.estudiante2){
                    if(user._id === proyecto.estudiante2._id){
                        proyecto.estudiante2 = undefined;
                    }
                }else if(proyecto.estudiante3){
                    if(user._id === proyecto.estudiante3._id){
                        proyecto.estudiante3 = undefined;
                    }
                }
                if(proyecto.estudiante){
                    proyecto.estudiante.rol = undefined;
                    proyecto.estudiante.contraseña = undefined;
                    proyecto.estudiante.usuario = undefined;
                }
                if(proyecto.estudiante2){
                    proyecto.estudiante2.rol = undefined;
                    proyecto.estudiante2.contraseña = undefined;
                    proyecto.estudiante2.usuario = undefined;
                }
                if(proyecto.estudiante3){
                    proyecto.estudiante3.rol = undefined;
                    proyecto.estudiante3.contraseña = undefined;
                    proyecto.estudiante3.usuario = undefined;
                }
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    proyecto: proyecto
                });
            }
        });
});
//=====================================================
//            GET-Proyecto - filtro
//=====================================================
app.post('/filtro', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {
    Proyecto.find(req.body)
        .populate({ path: 'estudiante estudiante2 estudiante3 director jurado1 jurado2', select:'nombres apellidos correo creditos_aprobados codigo identificacion eps telefono'})
        .populate({path:'lineaInvestigacion', select:'nombre'})
        .exec((err, proyectos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error',
                    err: err
                });
            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    proyectos: proyectos
                });
            }
        });
});
//=====================================================
//            GET-Proyecto-por director
//=====================================================
app.get('/director/:director', [mdAuth.VerificarToken, mdAuth.VerificarDirector], (req, res) => {
    Proyecto.find({director: req.params.director, estado: "En ejecución"})
        .populate({
            path:'estudiante estudiante2 estudiante3',
            select:'nombres apellidos correo creditos_aprobados codigo identificacion telefono'})
        .populate({path:'lineaInvestigacion', select:'nombre'})
            .exec((err, proyectos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error',
                    err: err
                });
            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    proyectos: proyectos
                });
            }
        });
});
//=====================================================
//           GET-Proyecto - Por asignar jurados
//=====================================================
app.get('/asignarJurado/:programa', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {
    Proyecto.find({estado_proyecto: 'Aprobado', programa: req.params.programa, jurado1: { $exists: false }, jurado2: { $exists: false }})
        .populate({
            path:'estudiante estudiante2 estudiante3 director',
            select:'nombres apellidos correo creditos_aprobados codigo identificacion telefono'})
        .populate({path:'lineaInvestigacion', select:'nombre'})
        .exec((err, proyectos) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error'
                });
            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    proyectos: proyectos
                });
            }
        });
});
//=====================================================
//           GET-Proyecto - por jurado
//=====================================================
app.get('/jurado/:jurado', [mdAuth.VerificarToken, mdAuth.VerificarDirector], (req, res) => {
    Proyecto.find({estado: "Sustentación", estado_proyecto: { $in: [ "Enviado", "Aprobado" ] },
    jurado1: req.params.jurado, evaluacion_jurado1: {$ne: "Aprobada"} })
    .populate({
        path:'estudiante estudiante2 estudiante3 director jurado1 jurado2',
        select:'nombres apellidos correo creditos_aprobados codigo identificacion telefono'})
    .populate({path:'lineaInvestigacion', select:'nombre'})
    .exec((err, proyectos) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ha ocurrido un error',
                err: err
            });
        } else if(proyectos.length === 0){
            Proyecto.find({estado: "Sustentación", estado_proyecto: { $in: [ "Enviado", "Aprobado" ] },
            jurado2: req.params.jurado, evaluacion_jurado2: {$ne: "Aprobada"} })
            .populate({
                path:'estudiante estudiante2 estudiante3 director jurado1 jurado2',
                select:'nombres apellidos correo creditos_aprobados codigo identificacion telefono'})
            .populate({path:'lineaInvestigacion', select:'nombre'})
            .exec((errr, proyectoss) => {
                if (errr) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Lo sentimos, ha ocurrido un error',
                        err: err
                    });
                }else{
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente',
                        proyectos: proyectoss
                    }); 
                }
            })
        }else{
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                proyectos: proyectos
            });
        }
    });
});
//=====================================================
//                aceptar-Proyecto
//=====================================================
app.put('/aprobarSerParteProyecto/:id', [mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {
    const id = req.params.id;
    Proyecto.findById(id)
    .populate({path:'estudiante estudiante2 estudiante3', select:"nombres apellidos correo"})
    .exec((err, proyecto) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ha ocurrido un error',
                err: err
            });
        } else if (!proyecto) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, no se encontró su solicitud'
            })
        } else {
            const user = req.usuario;
            if(proyecto.estudiante2){
                if(user._id == proyecto.estudiante2._id){
                    proyecto.aprobacionEstudiante2 = true;
                }
            }
            if(proyecto.estudiante3){
                if(user._id == proyecto.estudiante3._id){
                    proyecto.aprobacionEstudiante3 = true;
                }
            }
            if(proyecto.aprobacionEstudiante2 && proyecto.aprobacionEstudiante3 && proyecto.estudiante2 && proyecto.estudiante3){
                proyecto.estado = "Enviado";
                proyecto.estado_propuesta = "Enviada";
            }
            if(proyecto.aprobacionEstudiante2 && proyecto.estudiante2 && !proyecto.estudiante3 && !proyecto.aprobacionEstudiante3){
                proyecto.estado = "Enviado";
                proyecto.estado_propuesta = "Enviada";
            }
            proyecto.save((err,proyectoSave)=>{
                if(err){
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Lo sentimos, ha ocurrido un error',
                        err: err
                    });
                }else{
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente',
                        proyectoSave: proyectoSave
                    });
                }
            });
        }   
    });
});
//=====================================================
//                Rechazar-Proyecto
//=====================================================
app.put('/rechazarSerParteProyecto/:id', [mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {
    const id = req.params.id;
    Proyecto.findById(id).exec((err, proyecto) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ha ocurrido un error',
                err: err
            });
        } else if (!proyecto) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, no se encontró su solicitud'
            })
        } else {
            const user = req.usuario;
            var id = "";
            if(user._id == proyecto.estudiante2){
                id = proyecto.estudiante2;
                proyecto.estudiante2 = undefined;
            }else if(proyecto.estudiante3){
                if(user._id == proyecto.estudiante3){
                    id = proyecto.estudiante3;
                    proyecto.estudiante3 = undefined;
                }
            }else{
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error',
                    err: err
                });
            }
            proyecto.save((err,proyectoSave)=>{
                if(err){
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Lo sentimos, ha ocurrido un error',
                        err: err
                    });
                }else{
                    Estudiante.findById(id).exec((err,estudiante)=>{
                        if (err) {
                            res.status(500).json({
                                ok: false,
                                mensaje: 'Lo sentimos, ha ocurrido un error',
                                err: err
                            });
                        } else if (!estudiante) {
                            res.status(500).json({
                                ok: false,
                                mensaje: 'Lo sentimos, no se encontró ningún estudiante'
                            })
                        } else {
                            estudiante.modalidad = undefined;
                            estudiante.onModel = undefined;
                            estudiante.save((err,estudianteGuardado)=>{
                                if(err){
                                    res.status(500).json({
                                        ok: false,
                                        mensaje: 'Lo sentimos, ha ocurrido un error',
                                        err: err
                                    });
                                }else{
                                    res.status(200).json({
                                        ok: true,
                                        mensaje: 'Petición realizada correctamente',
                                        estudianteGuardado: estudianteGuardado,
                                        proyectoSave: proyectoSave
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }   
    });
});
//=====================================================
//                Aprobar/rechazar-Proyecto
//=====================================================
app.put('/jefeProyecto/:id', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {
    Proyecto.findById(req.params.id).exec((err, proyecto) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ha ocurrido un error',
                err: err
            });
        } else if (!proyecto) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, no se encontró el proyecto'
            })
        } else {
            proyecto.estado = req.body.estado;
            if(req.body.estado_propuesta){
                proyecto.estado_propuesta = req.body.estado_propuesta;
            }
            if(req.body.director){
                proyecto.director = req.body.director;
            }
            if(req.body.notas){
                proyecto.notas_propuesta = req.body.notas
            }
            if(req.body.estado === "En ejecución"){
                const ahora = new Date();
                proyecto.fecha_aprobacion = ahora;
            }
            proyecto.save((error, proyectoSave) => {
                if(error){
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Lo sentimos, ha ocurrido un error',
                        err: error
                    });
                }else{
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente',
                    });
                }
            });
        }
    });
});
//=====================================================
//            Gestion director -Proyecto
//=====================================================
app.put('/directorProyecto/:id', [mdAuth.VerificarToken, mdAuth.VerificarDirector], (req, res) => {
    Proyecto.findById(req.params.id).exec((err, proyecto) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ha ocurrido un error',
                err: err
            });
        } else if (!proyecto) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, no se encontró el proyecto'
            })
        } else {
            if(req.body.estado_propuesta){
                proyecto.estado_propuesta = req.body.estado_propuesta;
            }
            if(req.body.estado_anteproyecto){
                proyecto.estado_anteproyecto = req.body.estado_anteproyecto;
            }
            if(req.body.estado_proyecto){
                proyecto.estado_proyecto = req.body.estado_proyecto;
            }
            if(req.body.notas_propuesta){
                proyecto.notas_propuesta = req.body.notas_propuesta;
            }
            if(req.body.notas_anteproyecto){
                proyecto.notas_anteproyecto = req.body.notas_anteproyecto;
            }
            if(req.body.notas_proyecto){
                proyecto.notas_proyecto = req.body.notas_proyecto;
            }
            if(proyecto.estado_propuesta === "Aprobada" && proyecto.estado_anteproyecto === "Aprobado" && proyecto.estado_proyecto === "Aprobado"){
                proyecto.estado = "Sustentación";
            }
            proyecto.save((error, proyectoSave) => {
                if(error){
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Lo sentimos, ha ocurrido un error',
                        err: error
                    });
                }else{
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente',
                        proyectoSave: proyectoSave
                    });
                }
            });
        }
    });
});
//=====================================================
//            Asignar jurados -Proyecto
//=====================================================
app.put('/asignarJurados/:id', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {
    Proyecto.findById(req.params.id).exec((err, proyecto) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ha ocurrido un error',
                err: err
            });
        } else if (!proyecto) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, no se encontró el proyecto'
            })
        } else {
            const fecha = new Date();
            const fechaArray = req.body.fecha.split(/\D/);
            const horaArray = req.body.hora.split(/\D/);
            var fecha_sustentacion =  new Date(fechaArray[0], --fechaArray[1], fechaArray[2], horaArray[0], horaArray[1]); 
            var max = fecha.getTime()+(1000*60*60*24*33);
            var min = fecha.getTime()+(1000*60*60*24*3);
            var fechaNum = fecha_sustentacion.getTime();

            if(fechaNum > min && fechaNum < max){
                proyecto.jurado1 = req.body.jurado1;
                proyecto.jurado2 = req.body.jurado2;
                proyecto.sustentacion_fecha = fecha_sustentacion;
                proyecto.sustentacion_lugar = req.body.lugar;
    
                proyecto.save((err, proyectoSave) => {
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
            }else{
                res.status(500).json({
                    ok: false,
                    mensaje: 'La fecha de la sustentacion no es valida;',
                    err: err
                });
            }
        }
    });
});
//=====================================================
//            Evaluar - Proyecto
//=====================================================
app.put('/evaluar/:id', [mdAuth.VerificarToken, mdAuth.VerificarDirector], (req, res) => {
    const body = req.body;
    Proyecto.findById(req.params.id, (err, proyecto) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!proyecto) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });
        } else {
            if(body.jurado == proyecto.jurado1){
                proyecto.evaluacion_jurado1 = body.evaluacion;
                proyecto.notas_jurado1 = body.notas;
            }else if(body.jurado == proyecto.jurado2){
                proyecto.evaluacion_jurado2 = body.evaluacion;
                proyecto.notas_jurado2 = body.notas;
            }else{
                res.status(500).json({
                    ok: false,
                    mensaje: 'no corresponde a ninguna jurado',
                    err: err
                });
            }
            if(proyecto.evaluacion_jurado1 == 'Ajustar' || proyecto.evaluacion_jurado2 == 'Ajustar'){
                proyecto.estado_proyecto = 'Ajustar';
            }
            if(proyecto.evaluacion_jurado1 == 'Aprobada' && proyecto.evaluacion_jurado2 == 'Aprobada'){
                proyecto.estado = 'Aprobado';
                proyecto.estado_proyecto = "Aprobado";
            }
            proyecto.save((err, proyectoActualizado) => {
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
                        proyectoActualizado: proyectoActualizado
                    });
                }
            });
        }
    });
});


module.exports = app;