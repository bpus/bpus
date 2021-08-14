var express = require('express');
var fileUpload = require('express-fileupload');
var fileSystem = require('fs');
var Convenio = require('../models/Convenio');
var mdAuth = require('../middlewares/autenticacion');

var app = express();
app.use(fileUpload());

app.put('/:idConvenio', [mdAuth.VerificarToken], (req, res) => {
    var id_convenio = req.params.idConvenio;
    var documento_convenio = req.files.documento_convenio;
    Convenio.findById(id_convenio, (err, convenio) => {

        var documentoPropuesta = setDocumento(documento_convenio, "documento_convenio", convenio.empresa, res);
        convenio.rutapdf = documentoPropuesta;

        convenio.save((err, convenioActualizado) => {

            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                convenioActualizado: convenioActualizado
            });
        });

    });


});

function setDocumento(documento, tipoDocumeto, id_empresa, res) {

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

        var nombreGuardar = `${id_empresa}-${tipoDocumeto}.${extensionArchivo}`;

        // Movemos el archivo a una carpeta del servidor
        var pathCrear = `./uploads/documents/convenios/${id_empresa}`;
        var path = `./uploads/documents/convenios/${id_empresa}/${nombreGuardar}`;

        if(!fileSystem.existsSync('./uploads/documents/convenios')){
            fileSystem.mkdirSync('./uploads/documents/convenios');
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