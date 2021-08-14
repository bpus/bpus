var express = require('express');
var fileUpload = require('express-fileupload');
var fileSystem = require('fs');
var Pasantia = require('../models/Pasantia');
var mdAuth = require('../middlewares/autenticacion');

var app = express();
app.use(fileUpload());

app.put('/:idEstudiante', [mdAuth.VerificarToken], (req, res) => {

    var id_estudiante = req.params.idEstudiante;

    if (req.files.documento_propuesta) {
        var documento_propuesta = req.files.documento_propuesta;
        var documentoPropuesta = setDocumento(documento_propuesta, "documento_propuesta", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },
            { documento_propuesta: documentoPropuesta, estado: "Enviada", estado_propuesta: "Enviada"},
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }if (req.files.documento_actpropuesta) {
        var documento_propuesta = req.files.documento_actpropuesta;
        var documentoPropuesta = setDocumento(documento_propuesta, "documento_propuesta", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },
            { documento_propuesta: documentoPropuesta, estado_propuesta: "Enviada"},
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }else if(req.files.documento_fichaAcademica){
        var documento_fichaAcademica = req.files.documento_fichaAcademica;
        var documentofichaAcademica = setDocumento(documento_fichaAcademica, "documento_fichaAcademica", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },{ documento_fichaAcademica: documentofichaAcademica },
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }else if (req.files.carta_presentacion){
        var carta_presentacion = req.files.carta_presentacion;
        var cartapresentacion = setDocumento(carta_presentacion, "carta_presentacion", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },{ carta_presentacion: cartapresentacion},
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }else if (req.files.documento_arl) {
        var documento_arl = req.files.documento_arl;
        var date = req.query.fecha_arl;
        var fecha = date.split(/\D/);
        var fecha_arl =  new Date(fecha[0], --fecha[1], fecha[2]);
        var documentoArl = setDocumento(documento_arl, "documento_arl", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },{ documento_arl: documentoArl, fecha_arl: fecha_arl},(err, pasantiaAct) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                    error: err
                });
            } else {
                res.status(200).json({
                    ok: true,
                    pasantia: pasantiaAct
                });
            }
        });
    }else if (req.files.documento_actaInicio){
        var documento_actaInicio = req.files.documento_actaInicio;
        var date = req.query.fecha_actaInicio;
        var fecha = date.split(/\D/);
        var fecha_actaInicio =  new Date(fecha[0], --fecha[1], fecha[2]);
        var documentoactaInicio = setDocumento(documento_actaInicio, "documento_actaInicio", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },{ documento_actaInicio: documentoactaInicio, fecha_actaInicio: fecha_actaInicio, estado_actaInicio:'Enviada'},
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }else if (req.files.documento_informe7) {
        var documento_informe7 = req.files.documento_informe7;
        var documentoInf7 = setDocumento(documento_informe7, "documento_informe7", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante }, { documento_informe7: documentoInf7, estado_informe7: "Enviado"},
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }else if (req.files.documento_informe14){
        var documento_informe14 = req.files.documento_informe14;
        var documentoInf14 = setDocumento(documento_informe14, "documento_informe14", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },{ documento_informe14: documentoInf14, estado_informe14: "Enviado"},
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }else if (req.files.documento_informeFinal){
        var documento_informeFinal = req.files.documento_informeFinal;
        var documentoInfFinal = setDocumento(documento_informeFinal, "documento_informeFinal", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },{ documento_informeFinal: documentoInfFinal, estado_informeFinal: "Enviado"},
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }else if (req.files.documento_aprobacionEmpresa){
        var documento_aprobacionEmpresa = req.files.documento_aprobacionEmpresa;
        var documentoAprobacionEmpresa = setDocumento(documento_aprobacionEmpresa, "documento_aprobacionEmpresa", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },{ documento_aprobacionEmpresa: documentoAprobacionEmpresa},
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }else if (req.files.documento_evaluacion_pasantia){
        var documento_evaluacion_pasantia = req.files.documento_evaluacion_pasantia;
        var jurado = req.query.jurado;
        Pasantia.find({estudiante: id_estudiante}, (err, pasantia) =>{
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
                if(pasantia[0].jurado1 == jurado){
                    var documentoEvaluacionJurado = setDocumento(documento_evaluacion_pasantia, "documento_evaluacion_jurado1", id_estudiante, res);
                    pasantia[0].documento_evaluacion_jurado1 = documentoEvaluacionJurado;
                }else if(pasantia[0].jurado2 == jurado){
                    var documentoEvaluacionJurado = setDocumento(documento_evaluacion_pasantia, "documento_evaluacion_jurado2", id_estudiante, res);
                    pasantia[0].documento_evaluacion_jurado2 = documentoEvaluacionJurado;
                }
                pasantia[0].save((err, pasantiaActualizada) => {
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
        })
    }
});





function setDocumento(documento, tipoDocumeto, id_estudiante, res) {

    var nombreCortado = documento.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Hacemos una lista de las extensiones permitidas
    var extensionesValidas = ['pdf', 'PDF'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: "Tipo de archivo no permitido",
        });

    } else {

        var nombreGuardar = `${id_estudiante}-${tipoDocumeto}.${extensionArchivo}`;

        // Movemos el archivo a una carpeta del servidor
        var pathCrear = `./uploads/documents/pasantia/${id_estudiante}`;
        var path = `./uploads/documents/pasantia/${id_estudiante}/${nombreGuardar}`;

        if(!fileSystem.existsSync('./uploads/documents/pasantia')){
            fileSystem.mkdirSync('./uploads/documents/pasantia');
        }

        if (!fileSystem.existsSync(pathCrear)) {
            fileSystem.mkdirSync(pathCrear);
        }

        if (fileSystem.existsSync(path)) {
            fileSystem.unlinkSync(path);
        }

        documento.mv(path, err => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al mover el archivo",
                    error: err

                });
            }

        });

        return nombreGuardar;
    }
}


module.exports = app;