var express = require('express');
var fileUpload = require('express-fileupload');
var fileSystem = require('fs');
var Proyecto = require('../models/proyecto');
var mdAuth = require('../middlewares/autenticacion');

var app = express();
app.use(fileUpload());

app.put('/:idProyecto', [mdAuth.VerificarToken], (req, res) => {

    var id_proyecto = req.params.idProyecto;

    if(req.files.documento_fichaAcademica){
        var documento_fichaAcademica = req.files.documento_fichaAcademica;
        var documentofichaAcademica = setDocumento(documento_fichaAcademica, "documento_fichaAcademica", id_proyecto, res);
        Proyecto.findOneAndUpdate({ _id: id_proyecto },{ documento_fichaAcademica: documentofichaAcademica },
            (err, proyectoAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        proyecto: proyectoAct
                    });
                }
            });
    }
    else if(req.files.documento_fichaAcademica2){
        var documento_fichaAcademica2 = req.files.documento_fichaAcademica2;
        var documentofichaAcademica2 = setDocumento(documento_fichaAcademica2, "documento_fichaAcademica2", id_proyecto, res);
        Proyecto.findOneAndUpdate({ _id: id_proyecto },{ documento_fichaAcademica2: documentofichaAcademica2 },
            (err, proyectoAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        proyecto: proyectoAct
                    });
                }
            });
    }else if(req.files.documento_fichaAcademica3){
        var documento_fichaAcademica3 = req.files.documento_fichaAcademica3;
        var documentofichaAcademica3 = setDocumento(documento_fichaAcademica3, "documento_fichaAcademica3", id_proyecto, res);
        Proyecto.findOneAndUpdate({ _id: id_proyecto },{ documento_fichaAcademica3: documentofichaAcademica3 },
            (err, proyectoAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        proyecto: proyectoAct
                    });
                }
            });
    }else if (req.files.documento_anteproyecto) {
        var documento_anteproyecto = req.files.documento_anteproyecto;
        var documentoAnteProyecto = setDocumento(documento_anteproyecto, "documento_anteproyecto", id_proyecto, res);
        Proyecto.findOneAndUpdate({ _id: id_proyecto }, { documento_anteproyecto: documentoAnteProyecto, estado_anteproyecto: "Enviado", notas_anteproyecto: undefined},
            (err, proyectoAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        proyecto: proyectoAct
                    });
                }
            });
    }else if (req.files.documento_proyecto){
        var documento_proyecto = req.files.documento_proyecto;
        var documentoProyecto = setDocumento(documento_proyecto, "documento_proyecto", id_proyecto, res);
        Proyecto.findOneAndUpdate({ _id: id_proyecto },{ documento_proyecto: documentoProyecto, estado_proyecto: "Enviado", notas_proyecto: undefined},
            (err, proyectoAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        proyecto: proyectoAct
                    });
                }
            });
    }else if (req.files.documento_propuesta){
        var documento_propuesta = req.files.documento_propuesta;
        var documentoInscripcion = setDocumento(documento_propuesta, "documento_propuesta", id_proyecto, res);
        Proyecto.findById(id_proyecto).exec((err, proyecto) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                    error: err
                });
            } else {
                proyecto.documento_propuesta =  documentoInscripcion;
                proyecto.estado_propuesta = "Enviada";
                proyecto.notas_propuesta = undefined;
                if((proyecto.estudiante2 || proyecto.estudiante3) && proyecto.estado === "Pendiente"){
                    proyecto.estado_propuesta = "Pendiente";
                }
                if(proyecto.estado === "Ajustar"){
                    proyecto.estado = "Enviado"
                } 
                proyecto.save((err, proyectoAct) => {
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Lo sentimos, ocurrió un error',
                            err: err
                        });
                    } else {
                        res.status(200).json({
                            ok: true,
                            proyecto: proyectoAct
                        });
                    }
                });
            }
        });   
    }else if (req.files.documento_evaluacion_proyecto){
        var documento_evaluacion_proyecto = req.files.documento_evaluacion_proyecto;
        var jurado = req.query.jurado;
        Proyecto.findById(id_proyecto).exec((err, proyecto) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ocurrió un error',
                    err: err
                });
            } else if (!proyecto) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontró ninguna proyecto',
                    err: err
                });
            } else {
                if(proyecto.jurado1 == jurado){
                    var documentoEvaluacionJurado = setDocumento(documento_evaluacion_proyecto, "documento_evaluacion_jurado1", id_proyecto, res);
                    proyecto.documento_evaluacion_jurado1 = documentoEvaluacionJurado;
                }else if(proyecto.jurado2 == jurado){
                    var documentoEvaluacionJurado = setDocumento(documento_evaluacion_proyecto, "documento_evaluacion_jurado2", id_proyecto, res);
                    proyecto.documento_evaluacion_jurado2 = documentoEvaluacionJurado;
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
    }
});





function setDocumento(documento, tipoDocumeto, id_proyecto, res) {

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

        var nombreGuardar = `${id_proyecto}-${tipoDocumeto}.${extensionArchivo}`;

        // Movemos el archivo a una carpeta del servidor
        var pathCrear = `./uploads/documents/proyectos/${id_proyecto}`;
        var path = `./uploads/documents/proyectos/${id_proyecto}/${nombreGuardar}`;

        if(!fileSystem.existsSync('./uploads/documents/proyectos')){
            fileSystem.mkdirSync('./uploads/documents/proyectos');
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