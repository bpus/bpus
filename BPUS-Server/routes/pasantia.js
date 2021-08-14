var express = require('express');
var app = express();
var Pasantia = require('../models/Pasantia');
var Estudiante = require('../models/estudiante');
var Vacante = require('../models/Vacante');
var mdAuth = require('../middlewares/autenticacion');

//=====================================================
//                   GET-PASANTIA
//=====================================================
app.get('/porPrograma/:programa', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {

    Pasantia.find({estado: 'Enviada', programa: req.params.programa })
        .populate({path:'estudiante tutor', select:'nombres apellidos correo creditos_aprobados codigo identificacion eps telefono'})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}}})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono'}}})
        .populate({ path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}})
        .populate({ path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono naturaleza'}})
        .populate({path:'lineaInvestigacion', select:'nombre'})
        .exec((err, pasantias) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error'
                });
            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    pasantias: pasantias
                });
            }
        });
});
//=====================================================
//               GET-PASANTIA -TUTOR
//=====================================================
app.get('/tutor:tutor', [mdAuth.VerificarToken, mdAuth.VerificarDirector], (req, res) => {
    Pasantia.find({tutor: req.params.tutor, estado: "En ejecución"})
        .populate({path:'estudiante tutor', select:'nombres apellidos correo creditos_aprobados codigo identificacion eps telefono'})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}}})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono'}}})
        .populate({ path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}})
        .populate({ path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono naturaleza'}})
        .populate({path:'lineaInvestigacion', select:'nombre'})
        .exec((err, pasantias) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error'
                });
            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    pasantias: pasantias
                });
            }
        });
});
//=====================================================
//           GET-PASANTIA -Por asignar jurados
//=====================================================
app.get('/asignarJurado/:programa', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {
    Pasantia.find({estado_informeFinal: 'Aprobado', programa: req.params.programa, jurado1: { $exists: false }, jurado2: { $exists: false }})
        .populate({path:'estudiante tutor', select:'nombres apellidos correo creditos_aprobados codigo identificacion eps telefono'})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}}})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono'}}})
        .populate({ path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}})
        .populate({ path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono naturaleza'}})
        .populate({path:'lineaInvestigacion', select:'nombre'})
        .exec((err, pasantias) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error'
                });
            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    pasantias: pasantias
                });
            }
        });
});
//=====================================================
//           GET-PASANTIA - Jurado
//=====================================================
app.get('/jurado:jurado', [mdAuth.VerificarToken, mdAuth.VerificarDirector], (req, res) => {
    Pasantia.find({estado: "Sustentación", estado_informeFinal: { $in: [ "Enviado", "Aprobado" ] },
        jurado1: req.params.jurado, evaluacion_jurado1: {$ne: "Aprobada"} })
        .populate({path:'estudiante tutor', select:'nombres apellidos correo creditos_aprobados codigo identificacion eps telefono'})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}}})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono'}}})
        .populate({ path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}})
        .populate({ path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono naturaleza'}})
        .populate({path:'lineaInvestigacion', select:'nombre'})
        .exec((err, pasantias) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error'
                });
            } else if(pasantias.length === 0){
                Pasantia.find({estado: "Sustentación", estado_informeFinal: { $in: [ "Enviado", "Aprobado" ] },
                jurado2: req.params.jurado, evaluacion_jurado2: {$ne: "Aprobada"} })
                .populate({path:'estudiante tutor', select:'nombres apellidos correo creditos_aprobados codigo identificacion eps telefono'})
                .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}}})
                .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono'}}})
                .populate({ path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}})
                .populate({ path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono naturaleza'}})
                .populate({path:'lineaInvestigacion', select:'nombre'})
                .exec((err, pasantiass) => {
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Lo sentimos, ha ocurrido un error'
                        });
                    }else{
                        res.status(200).json({
                            ok: true,
                            mensaje: 'Petición realizada correctamente',
                            pasantias: pasantiass
                        });
                    }
                })
            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    pasantias: pasantias
                });
            }
        });
});
//=====================================================
//            GET-PASANTIA - encargado
//=====================================================
app.get('/encargado', [mdAuth.VerificarToken, mdAuth.VerificarEncargado], (req, res) => {
    Pasantia.find({estado: "PreInscrita", aprobacionEmpresa: false})
        .populate({path:'estudiante tutor', select:'nombres apellidos correo creditos_aprobados codigo identificacion eps telefono'})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}}})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono'}}})
        .populate({ path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}})
        .populate({ path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono naturaleza'}})
        .populate({path:'lineaInvestigacion', select:'nombre'})
        .exec((err, pasantias) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error'
                });
            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    pasantias: pasantias
                });
            }
        });
});
//=====================================================
//               GET-PASANTIA POR ID
//=====================================================
app.get('/:id', [mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {
    Pasantia.findById(req.params.id)
        .populate({path:'estudiante tutor jurado1 jurado2', select:'nombres apellidos correo'})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}}})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono'}}})
        .populate({ path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}})
        .populate({ path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono naturaleza'}})
        .populate({path:'lineaInvestigacion', select:'nombre'})
        .exec((err, pasantia) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error'
                });
            } else if (!pasantia) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, no se encontró su solicitud'
                });
            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    pasantia: pasantia
                });
            }
        });
});
//=====================================================
//             GET-PASANTIA POR Filtro
//=====================================================
app.post('/filtro', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {
    Pasantia.find(req.body)
        .populate({path:'estudiante tutor jurado1 jurado2', select:'nombres apellidos correo creditos_aprobados codigo identificacion eps telefono'})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}}})
        .populate({path: 'vacante', populate: { path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono'}}})
        .populate({ path: 'convenio', populate: {path: 'encargado', select: 'nombres apellidos telefono correo cargo'}})
        .populate({ path: 'convenio', populate: {path: 'empresa', select: 'nombre ciudad direccion telefono'}})
        .populate({path:'lineaInvestigacion', select:'nombre'})
        .exec((err, pasantias) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error'
                });
            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    pasantias: pasantias
                });
            }
        });
});
//=====================================================
//       PUT - PASANTIA- CAMBIAR ESTADO ENCARGADO
//=====================================================
app.put('/cambiarEstado:idEstudiante', [mdAuth.VerificarToken, mdAuth.VerificarEncargado], (req, res) => {

    var estado = req.query.estado;
    var id = req.params.idEstudiante;

    Pasantia.findById(id, (err, pasantia) => {
        if (err) {
            res.status(500).json({

                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!pasantia) {
            res.status(400).json({

                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });
        } else {
            pasantia.aprobacionEmpresa = estado;
            if(estado == 'false'){
                pasantia.estado = "Ajustar";
            }
            pasantia.save((err, pasantiaActualizada) => {
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
//=====================================================
//                   POST-PASANTIA
//=====================================================
app.post('/:idEstudiante', [mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {

    var body = req.body;
    var idEstudiante = req.params.idEstudiante;

    var epsEstudiante = body.eps;

    var solicitud = new Pasantia({
        estudiante: idEstudiante,
        programa: req.usuario.programa,
        vacante: body.vacante,
        lineaInvestigacion: body.lineaInvestigacion,
        estado: 'PreInscrita',
    });

    solicitud.save((err, solicitudGuardada) => {

        if (err) {

            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ha ocurrido un error',
                err: err
            });
        } else {

            Estudiante.findById(idEstudiante, (err, estudiante) => {

                estudiante.modalidad = solicitudGuardada._id;
                estudiante.eps = epsEstudiante;
                estudiante.onModel = 'Pasantia';
                estudiante.save((err, estudianteSave) => {
                    if(err){
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Lo sentimos, ocurrió un error',
                            err: error
                        });
                    }else{
                        estudianteSave.rol = undefined;
                        estudianteSave.contraseña = undefined;
                        estudianteSave.usuario = undefined;
                        res.status(200).json({
                            ok: true,
                            mensaje: 'Petición realizada correctamente',
                            solicitudGuardada: solicitudGuardada,
                            estudianteActualizado: estudianteSave
                        });
                    }
                });
            });
        }
    });
});
//=====================================================
//               POST-PASANTIA-DIRECTA
//=====================================================
app.post('/direct/:idEstudiante', [mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {

    var body = req.body;
    var idEstudiante = req.params.idEstudiante;
    var epsEstudiante = body.eps;

    var solicitud = new Pasantia({
        estudiante: idEstudiante,
        programa: req.usuario.programa,
        convenio: body.convenio,
        lineaInvestigacion: body.lineaInvestigacion,
        titulo: body.titulo,
        descripcion: body.descripcion,
        estado: 'Enviada',
        aprobacionEmpresa: true,
    });

    solicitud.save((err, solicitudGuardada) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ha ocurrido un error',
                err: err
            });
        } else {
            Estudiante.findById(idEstudiante, (err, estudiante) => {            
                estudiante.modalidad = solicitudGuardada._id;
                estudiante.eps = epsEstudiante;
                estudiante.onModel = 'Pasantia';
                estudiante.save((err, estudianteSave) => {
                    if(err){
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Lo sentimos, ocurrió un error',
                            err: error
                        });
                    }else{
                        estudianteSave.rol = undefined;
                        estudianteSave.contraseña = undefined;
                        estudianteSave.usuario = undefined;
                        res.status(200).json({
                            ok: true,
                            mensaje: 'Petición realizada correctamente',
                            solicitudGuardada: solicitudGuardada,
                            estudianteActualizado: estudianteSave
                        });
                    }
                });
            });
        }
    });
});
/* ====================================================
                PUT PASANTIA Propuesta
=======================================================*/
app.put('/propuesta:id', [mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {

    var body = req.body;
    var id = req.params.id;

    Pasantia.findById(id, (err, pasantia) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });

        } else if (!pasantia) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });

        } else {

            pasantia.titulo = body.titulo;
            pasantia.descripcion = body.descripcion;

            pasantia.save((err, pasantiaActualizada) => {

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
                PUT PASANTIA re-inscripción
=======================================================*/
app.put('/reInscripcion/:id', [mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {

    var body = req.body;
    var id = req.params.id;

    Pasantia.findById(id, (err, pasantia) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!pasantia) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });
        } else {
            if(pasantia.vacante && body.convenio){
                pasantia.vacante = undefined;
                pasantia.convenio = body.convenio;
                pasantia.titulo = body.titulo;
                pasantia.descripcion = body.descripcion;
                pasantia.estado = "Enviada";
            }else if(pasantia.vacante && body.vacante){
                pasantia.vacante = body.vacante;
                pasantia.estado = "PreInscrita";
            }else if(pasantia.convenio && body.vacante){
                pasantia.convenio = undefined;
                pasantia.vacante = body.vacante;
                pasantia.estado = "PreInscrita";
            }else if(pasantia.convenio && body.convenio){
                pasantia.convenio = body.convenio;
                pasantia.titulo = body.titulo;
                pasantia.descripcion = body.descripcion;
                pasantia.estado = "Enviada";
            }
            pasantia.lineaInvestigacion = body.pasantia;
            pasantia.save((err, pasantiaActualizada) => {

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
                PUT PASANTIA JEFE
=======================================================*/
app.put('/jefe:id', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {

    var body = req.body;
    var id = req.params.id;

    Pasantia.findById(id, (err, pasantia) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!pasantia) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });
        } else {
            if(body.estado !== "En ejecución"){
                pasantia.estado_propuesta = body.estado_propuesta
            }

            pasantia.notas_propuesta = body.notas_propuesta
            pasantia.tutor = body.tutor;
            pasantia.estado = body.estado;

            pasantia.save((err, pasantiaActualizada) => {

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
                PUT PASANTIA TUTOR
=======================================================*/
app.put('/tutor:id', [mdAuth.VerificarToken, mdAuth.VerificarDirector], (req, res) => {

    var body = req.body;
    var id = req.params.id;

    Pasantia.findById(id, (err, pasantia) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!pasantia) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });
        } else {
            if(body.estado_propuesta){
                pasantia.estado_propuesta = body.estado_propuesta;
            }
            if(body.notas_propuesta){
                pasantia.notas_propuesta = body.notas_propuesta;
            }
            if(body.estado_actaInicio){
                pasantia.estado_actaInicio = body.estado_actaInicio;
            }
            if(body.notas_actaInicio){
                pasantia.notas_actaInicio = body.notas_actaInicio;
            }
            if(body.estado_informe7){
                pasantia.estado_informe7 = body.estado_informe7;
            }
            if(body.notas_informe7){
                pasantia.notas_informe7 = body.notas_informe7;
            }
            if(body.estado_informe14){
                pasantia.estado_informe14 = body.estado_informe14;
            }
            if(body.notas_informe14){
                pasantia.notas_informe14 = body.notas_informe14;
            }
            if(body.estado_informeFinal){
                pasantia.estado_informeFinal = body.estado_informeFinal;
            }
            if(body.notas_informeFinal){
                pasantia.notas_informeFinal = body.notas_informeFinal;
            }

            if(
                pasantia.estado_propuesta === "Aprobada" && 
                pasantia.estado_actaInicio === "Aprobada" && 
                pasantia.estado_informe7  === "Aprobado" &&
                pasantia.estado_informe14  === "Aprobado" &&
                pasantia.estado_informeFinal  === "Aprobado"
            ){
                pasantia.estado = "Sustentación";
            }

            pasantia.save((err, pasantiaActualizada) => {
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
                PUT PASANTIA ASIGNAR JURADOS
=======================================================*/
app.put('/asignarJurados:id', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {

    var id = req.params.id;

    Pasantia.findById(id, (err, pasantia) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!pasantia) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });
        } else {

            const fecha = new Date();
            const fechaArray = req.body.fecha.split(/\D/);
            const horaArray = req.body.hora.split(/\D/);
            var fecha_sustentacion =  new Date(fechaArray[0], --fechaArray[1], fechaArray[2], horaArray[0], horaArray[1]); 
            var max = fecha.getTime()+(1000*60*60*24*33);
            var min = fecha.getTime()+(1000*60*60*24*3);
            var fechaNum = fecha_sustentacion.getTime();

            if(fechaNum > min && fechaNum < max){
                pasantia.jurado1 = req.body.jurado1;
                pasantia.jurado2 = req.body.jurado2;
                pasantia.sustentacion_fecha = fecha_sustentacion;
                pasantia.sustentacion_lugar = req.body.lugar;

                pasantia.save((err, pasantiaActualizada) => {

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
/* ====================================================
                PUT PASANTIA Evaluar
=======================================================*/
app.put('/evaluar:id', [mdAuth.VerificarToken, mdAuth.VerificarDirector], (req, res) => {

    var body = req.body;
    var id = req.params.id;

    Pasantia.findById(id, (err, pasantia) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!pasantia) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });
        } else {
            if(body.jurado == pasantia.jurado1){
                pasantia.evaluacion_jurado1 = body.evaluacion;
                pasantia.notas_jurado1 = body.notas;
            }else if(body.jurado == pasantia.jurado2){
                pasantia.evaluacion_jurado2 = body.evaluacion;
                pasantia.notas_jurado2 = body.notas;
            }else{
                res.status(500).json({
                    ok: false,
                    mensaje: 'no corresponde a ninguna jurado',
                    err: err
                });
            }
            if(pasantia.evaluacion_jurado1 == 'Ajustar' || pasantia.evaluacion_jurado2 == 'Ajustar'){
                pasantia.estado_informeFinal = 'Ajustar';
            }
            if(pasantia.evaluacion_jurado1 == 'Aprobada' && pasantia.evaluacion_jurado2 == 'Aprobada'){
                pasantia.estado = 'Aprobada';
                pasantia.estado_informeFinal = 'Aprobado';
            }
            pasantia.save((err, pasantiaActualizada) => {
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
                        pasantiaActualizada: pasantiaActualizada
                    });
                }
            });
        }
    });
});

module.exports = app;