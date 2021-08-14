var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var Pasantia = require('../models/Pasantia');
var Notificacion = require('../models/Notificacion');
var mdAuth = require('../middlewares/autenticacion');
const credencialesSMTP = require('../models/credencialesSMTP');
var user = "";
var pass = "";
var transporter;

async function getCredencialesSMTP(){
    const credenciales = await credencialesSMTP.find({});
    user = await credenciales[0].user;
    pass = await credenciales[0].pass;
    transporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: user,
          pass: pass
        }
    });
}

/* ====================================================
                GET Notificaciones
=======================================================*/

app.get('/:usuarioId', [mdAuth.VerificarToken], (req, res) => {
    var usuarioId = req.params.usuarioId;
    Notificacion.find({'receptor': usuarioId }).sort({'fecha':-1}).populate('receptor').exec((err, notificaciones) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió unn error',
                er: err
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                notificaciones: notificaciones
            });
        }
    });
});
/* ====================================================
                GET Notificacion - Nav
=======================================================*/
app.get('/notificacionesNav/:usuarioId', [mdAuth.VerificarToken], (req, res) => {
    var usuarioId = req.params.usuarioId;
    Notificacion.find({'receptor': usuarioId, 'isRead': false}).sort({'fecha':-1}).populate('receptor').limit(3).exec((err, notificaciones) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                notificaciones: notificaciones
            });
        }
    });
});

/* ====================================================
                Delete Notificacion
=======================================================*/
app.delete('/:id', [mdAuth.VerificarToken], (req, res) => {
    
    const id = req.params.id;
    Notificacion.findByIdAndRemove(id, (err, notificacionEliminada) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!notificacionEliminada) {
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

/* ====================================================
            Delete Notificacion -todas
=======================================================*/
app.delete('/todas/:receptor', [mdAuth.VerificarToken], async(req, res) => {
    try {
        await Notificacion.deleteMany({receptor: req.params.receptor, isRead:true});
        res.status(200).json({
            ok: true,
            mensaje: 'Petición realizada correctamente',
        }); 
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: 'Lo sentimos, ocurrió un error',
            err: error
        });
    } 
});

/* ====================================================
                    Cambiar isRead
=======================================================*/
app.put('/leida/:id', [mdAuth.VerificarToken], (req, res) => {
    Notificacion.findById(req.params.id, (err, notificacion) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!notificacion) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna notificacion',
                err: err
            });
        }else{
            notificacion.isRead = true;
            notificacion.save((err, notificacionEditada) => {
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
                Cambiar isRead - todas
=======================================================*/
app.put('/leidaTodas/:receptor', [mdAuth.VerificarToken], async (req, res) => {
    try {
        await Notificacion.updateMany({receptor: req.params.receptor, isRead:false}, {isRead: true});
        res.status(200).json({
            ok: true,
            mensaje: 'Petición realizada correctamente',
        }); 
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: 'Lo sentimos, ocurrió un error',
            err: error
        });
    } 
});

app.post('/', [mdAuth.VerificarToken], (req, res) => {

    var body = req.body;
    var notificacion = new Notificacion({

        receptor: body.receptor,
        fecha: body.fecha,
        mensaje: body.mensaje,
        mensajeDetalle: body.mensajeDetalle,
        isRead: false,
        onModel: body.onModel

    });

    notificacion.save((err, notificacionGuardada) => {

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
                notificacionGuardada: notificacionGuardada
            });
        }
    });
});

app.post('/correo', [mdAuth.VerificarToken], (req, res) => {
    var body = req.body;
    async function sendMail(){
        try {
            await getCredencialesSMTP();
            const mailOptions = {
                from: 'BPUS <juan.quintero.test@gmail.com>',
                to: body.receptorCorreo,
                subject: body.mensaje,
                text: body.mensajeDetalle,
                html: `<!DOCTYPE html>
                <html lang="es">
                    <head>
                        <style>
                            .container{
                                padding: 3% 25%;
                                background-color:#1E262B;
                            }
                            .msg-container{
                                box-shadow: 
                                    0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                                background-color:#8F141B;
                                border-radius: 5px;
                                padding-top:15px;
                                padding-bottom:1px;    
                            }
                            body{
                                color: #DFD4A6;
                                font-family: 'Open Sans', Arial, Helvetica, sans-serif; 
                            }
                            
                            @media only screen and (max-width: 576px) {
                                .container{
                                    padding:3%;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="msg-container">
                                <div style="text-align:center;">
                                    <img src="https://www.usco.edu.co/imagen-institucional/ocre/universidad-surcolombiana-p.png">
                                    <h4 style="background-color: #DFD4A6; color:#1E262B; padding: 10px;">
                                        Banco de proyectos de la Universidad Surcolombiana
                                    </h4>
                                </div>
                                <h5 style="color: #DFD4A6; padding-left:15px; padding-right:15px;">
                                    ${body.mensajeDetalle}
                                </h5>
                            </div>
                        </div>
                    </body>
                </html>`
            };
            const result = await transporter.sendMail(mailOptions);
            return result;   
        } catch (error) {
            console.log(error);
        }
    }

    sendMail().then((result) => {
        res.status(200).json({
            ok: true,
            mensaje: 'Correro envidado exitosamente',
        });
    }).catch((error) => {
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo enviar el correo',
            err: error
        });
    });
});

app.post('/usuarioNuevo', [mdAuth.VerificarToken], (req, res) => {

    var body = req.body;    
    async function sendMail(){
        try {
            await getCredencialesSMTP();
            const mailOptions = {
                from: 'BPUS <juan.quintero.test@gmail.com>',
                to: body.correo,
                subject: 'Registrado en la plataforma',
                text: 'Podras acceder a la plataforma https://bpus-316916.web.app usando tu cédula:'+body.identificacion+', y tu contraseña es: '+body.identificacion,
                html: 
                '<h1>Bienvenido a BPUS</h1>'+
                '<h2><b>Información de usuario: </b></h2>'+
                `<h4><b>Nombre(s)</b>: ${body.nombres}</h4>`+
                `<h4><b>Apellidos</b>: ${body.apellidos}</h4>`+
                `<h4><b>Identificación</b>: ${body.identificacion}</h4>`+
                `<h4><b>Contraseña</b>: ${body.identificacion}</h4>`+
                `<h4><b>correo</b>: ${body.correo}</h4>`+
                `<h4><b>Teléfono</b>: ${body.telefono}</h4>`+
                '<br>'+
                '<p>Podras acceder a la <a href="https://bpus-316916.web.app" target="_blank">plataforma</a> usando tu cédula y la contraseña</p>'
            };
            const result = await transporter.sendMail(mailOptions);
            return result;   
        } catch (error) {
            console.log(error);
        }
    }

    sendMail().then((result) => {
        res.status(200).json({
            ok: true,
            mensaje: 'Correro envidado exitosamente',
        });
    }).catch((error) => {
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo enviar el correo',
            err: error
        });
    });
});

app.post('/correoPropusta:idEstudiante', [mdAuth.VerificarToken], (req, res) => {

    const id_estudiante = req.params.idEstudiante;
    const body = req.body;
    const nombreArchivo = id_estudiante+'-documento_propuesta.pdf'
    const path = `./uploads/documents/pasantia/${id_estudiante}/${nombreArchivo}`;

    async function sendMail(){
        try {
            await getCredencialesSMTP();
            const mailOptions = {
                from: 'BPUS <juan.quintero.test@gmail.com>',
                to: body.receptorCorreo,
                subject: body.mensaje,
                text: body.mensajeDetalle,
                html: `<!DOCTYPE html>
                <html lang="es">
                    <head>
                        <style>
                            .container{
                                padding: 3% 25%;
                                background-color:#1E262B;
                            }
                            .msg-container{
                                box-shadow: 
                                    0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                                background-color:#8F141B;
                                border-radius: 5px;
                                padding-top:15px;
                                padding-bottom:1px;    
                            }
                            body{
                                color: #DFD4A6;
                                font-family: 'Open Sans', Arial, Helvetica, sans-serif; 
                            }
                            
                            @media only screen and (max-width: 576px) {
                                .container{
                                    padding:3%;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="msg-container">
                                <div style="text-align:center;">
                                    <img src="https://www.usco.edu.co/imagen-institucional/ocre/universidad-surcolombiana-p.png">
                                    <h4 style="background-color: #DFD4A6; color:#1E262B; padding: 10px;">
                                        Banco de proyectos de la Universidad Surcolombiana
                                    </h4>
                                </div>
                                <h5 style="color: #DFD4A6; padding-left:15px; padding-right:15px;">
                                    ${body.mensajeDetalle}
                                </h5>
                            </div>
                        </div>
                    </body>
                </html>`,
                attachments: [{path: path}]
            };
            const result = await transporter.sendMail(mailOptions);
            return result;   
        } catch (error) {
            console.log(error);
        }
    }

    sendMail().then((result) => {
        res.status(200).json({
            ok: true,
            mensaje: 'Correro envidado exitosamente',
        });
    }).catch((error) => {
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo enviar el correo',
            err: error
        });
    });
});

app.post('/correoCartaPresentacion:idEstudiante', [mdAuth.VerificarToken], (req, res) => {

    const id_estudiante = req.params.idEstudiante;
    const body = req.body;
    const nombreArchivo = id_estudiante+'-carta_presentacion.pdf'
    const path = `./uploads/documents/pasantia/${id_estudiante}/${nombreArchivo}`;

    async function sendMail(){
        try {
            await getCredencialesSMTP();
            const mailOptions = {
                from: 'BPUS <juan.quintero.test@gmail.com>',
                to: body.receptorCorreo,
                subject: body.mensaje,
                text: body.mensajeDetalle,
                html: `<!DOCTYPE html>
                <html lang="es">
                    <head>
                        <style>
                            .container{
                                padding: 3% 25%;
                                background-color:#1E262B;
                            }
                            .msg-container{
                                box-shadow: 
                                    0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                                background-color:#8F141B;
                                border-radius: 5px;
                                padding-top:15px;
                                padding-bottom:1px;    
                            }
                            body{
                                color: #DFD4A6;
                                font-family: 'Open Sans', Arial, Helvetica, sans-serif; 
                            }
                            
                            @media only screen and (max-width: 576px) {
                                .container{
                                    padding:3%;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="msg-container">
                                <div style="text-align:center;">
                                    <img src="https://www.usco.edu.co/imagen-institucional/ocre/universidad-surcolombiana-p.png">
                                    <h4 style="background-color: #DFD4A6; color:#1E262B; padding: 10px;">
                                        Banco de proyectos de la Universidad Surcolombiana
                                    </h4>
                                </div>
                                <h5 style="color: #DFD4A6; padding-left:15px; padding-right:15px;">
                                    ${body.mensajeDetalle}
                                </h5>
                            </div>
                        </div>
                    </body>
                </html>`,
                attachments: [{path: path}]
            };
            const result = await transporter.sendMail(mailOptions);
            return result;   
        } catch (error) {
            console.log(error);
        }
    }

    sendMail().then((result) => {
        res.status(200).json({
            ok: true,
            mensaje: 'Correro envidado exitosamente',
        });
    }).catch((error) => {
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo enviar el correo',
            err: error
        });
    });
});

app.post('/correoActInicio:idEstudiante', [mdAuth.VerificarToken], (req, res) => {

    const id_estudiante = req.params.idEstudiante;
    const body = req.body;
    const nombreArchivo = id_estudiante+'-documento_actaInicio.pdf'
    const path = `./uploads/documents/pasantia/${id_estudiante}/${nombreArchivo}`;

    async function sendMail(){
        try {
            await getCredencialesSMTP();
            const mailOptions = {
                from: 'BPUS <juan.quintero.test@gmail.com>',
                to: body.receptorCorreo,
                subject: body.mensaje,
                text: body.mensajeDetalle,
                html: `<!DOCTYPE html>
                <html lang="es">
                    <head>
                        <style>
                            .container{
                                padding: 3% 25%;
                                background-color:#1E262B;
                            }
                            .msg-container{
                                box-shadow: 
                                    0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                                background-color:#8F141B;
                                border-radius: 5px;
                                padding-top:15px;
                                padding-bottom:1px;    
                            }
                            body{
                                color: #DFD4A6;
                                font-family: 'Open Sans', Arial, Helvetica, sans-serif; 
                            }
                            
                            @media only screen and (max-width: 576px) {
                                .container{
                                    padding:3%;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="msg-container">
                                <div style="text-align:center;">
                                    <img src="https://www.usco.edu.co/imagen-institucional/ocre/universidad-surcolombiana-p.png">
                                    <h4 style="background-color: #DFD4A6; color:#1E262B; padding: 10px;">
                                        Banco de proyectos de la Universidad Surcolombiana
                                    </h4>
                                </div>
                                <h5 style="color: #DFD4A6; padding-left:15px; padding-right:15px;">
                                    ${body.mensajeDetalle}
                                </h5>
                            </div>
                        </div>
                    </body>
                </html>`,
                attachments: [{path: path}]
            };
            const result = await transporter.sendMail(mailOptions);
            return result;   
        } catch (error) {
            console.log(error);
        }
    }

    sendMail().then((result) => {
        res.status(200).json({
            ok: true,
            mensaje: 'Correro envidado exitosamente',
        });
    }).catch((error) => {
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo enviar el correo',
            err: error
        });
    });

});

app.post('/correoInforme7:idEstudiante', [mdAuth.VerificarToken], (req, res) => {

    const id_estudiante = req.params.idEstudiante;
    const body = req.body;
    const nombreArchivo = id_estudiante+'-documento_informe7.pdf';
    const path = `./uploads/documents/pasantia/${id_estudiante}/${nombreArchivo}`;

    async function sendMail(){
        try {
            await getCredencialesSMTP();
            const mailOptions = {
                from: 'BPUS <juan.quintero.test@gmail.com>',
                to: body.receptorCorreo,
                subject: body.mensaje,
                text: body.mensajeDetalle,
                html: `<!DOCTYPE html>
                <html lang="es">
                    <head>
                        <style>
                            .container{
                                padding: 3% 25%;
                                background-color:#1E262B;
                            }
                            .msg-container{
                                box-shadow: 
                                    0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                                background-color:#8F141B;
                                border-radius: 5px;
                                padding-top:15px;
                                padding-bottom:1px;    
                            }
                            body{
                                color: #DFD4A6;
                                font-family: 'Open Sans', Arial, Helvetica, sans-serif; 
                            }
                            
                            @media only screen and (max-width: 576px) {
                                .container{
                                    padding:3%;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="msg-container">
                                <div style="text-align:center;">
                                    <img src="https://www.usco.edu.co/imagen-institucional/ocre/universidad-surcolombiana-p.png">
                                    <h4 style="background-color: #DFD4A6; color:#1E262B; padding: 10px;">
                                        Banco de proyectos de la Universidad Surcolombiana
                                    </h4>
                                </div>
                                <h5 style="color: #DFD4A6; padding-left:15px; padding-right:15px;">
                                    ${body.mensajeDetalle}
                                </h5>
                            </div>
                        </div>
                    </body>
                </html>`,
                attachments: [{path: path}]
            };
            const result = await transporter.sendMail(mailOptions);
            return result;   
        } catch (error) {
            console.log(error);
        }
    }

    sendMail().then((result) => {
        res.status(200).json({
            ok: true,
            mensaje: 'Correro envidado exitosamente',
        });
    }).catch((error) => {
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo enviar el correo',
            err: error
        });
    });
});

app.post('/correoInforme14:idEstudiante', [mdAuth.VerificarToken], (req, res) => {

    const id_estudiante = req.params.idEstudiante;
    const body = req.body;
    const nombreArchivo = id_estudiante+'-documento_informe14.pdf';
    const path = `./uploads/documents/pasantia/${id_estudiante}/${nombreArchivo}`;

    async function sendMail(){
        try {
            await getCredencialesSMTP();
            const mailOptions = {
                from: 'BPUS <juan.quintero.test@gmail.com>',
                to: body.receptorCorreo,
                subject: body.mensaje,
                text: body.mensajeDetalle,
                html: `<!DOCTYPE html>
                <html lang="es">
                    <head>
                        <style>
                            .container{
                                padding: 3% 25%;
                                background-color:#1E262B;
                            }
                            .msg-container{
                                box-shadow: 
                                    0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                                background-color:#8F141B;
                                border-radius: 5px;
                                padding-top:15px;
                                padding-bottom:1px;    
                            }
                            body{
                                color: #DFD4A6;
                                font-family: 'Open Sans', Arial, Helvetica, sans-serif; 
                            }
                            
                            @media only screen and (max-width: 576px) {
                                .container{
                                    padding:3%;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="msg-container">
                                <div style="text-align:center;">
                                    <img src="https://www.usco.edu.co/imagen-institucional/ocre/universidad-surcolombiana-p.png">
                                    <h4 style="background-color: #DFD4A6; color:#1E262B; padding: 10px;">
                                        Banco de proyectos de la Universidad Surcolombiana
                                    </h4>
                                </div>
                                <h5 style="color: #DFD4A6; padding-left:15px; padding-right:15px;">
                                    ${body.mensajeDetalle}
                                </h5>
                            </div>
                        </div>
                    </body>
                </html>`,
                attachments: [{path: path}]
            };
            const result = await transporter.sendMail(mailOptions);
            return result;   
        } catch (error) {
            console.log(error);
        }
    }

    sendMail().then((result) => {
        res.status(200).json({
            ok: true,
            mensaje: 'Correro envidado exitosamente',
        });
    }).catch((error) => {
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo enviar el correo',
            err: error
        });
    });
});

app.post('/correoInformeFinal:idEstudiante', [mdAuth.VerificarToken], (req, res) => {

    const id_estudiante = req.params.idEstudiante;
    const body = req.body;
    const informefinal = id_estudiante+'-documento_informeFinal.pdf';
    const path_informefinal = `./uploads/documents/pasantia/${id_estudiante}/${informefinal}`;
   
    async function sendMail(){
        try {
            await getCredencialesSMTP();
            const mailOptions = {
                from: 'BPUS <juan.quintero.test@gmail.com>',
                to: body.receptorCorreo,
                subject: body.mensaje,
                text: body.mensajeDetalle,
                html: `<!DOCTYPE html>
                <html lang="es">
                    <head>
                        <style>
                            .container{
                                padding: 3% 25%;
                                background-color:#1E262B;
                            }
                            .msg-container{
                                box-shadow: 
                                    0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                                background-color:#8F141B;
                                border-radius: 5px;
                                padding-top:15px;
                                padding-bottom:1px;    
                            }
                            body{
                                color: #DFD4A6;
                                font-family: 'Open Sans', Arial, Helvetica, sans-serif; 
                            }
                            
                            @media only screen and (max-width: 576px) {
                                .container{
                                    padding:3%;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="msg-container">
                                <div style="text-align:center;">
                                    <img src="https://www.usco.edu.co/imagen-institucional/ocre/universidad-surcolombiana-p.png">
                                    <h4 style="background-color: #DFD4A6; color:#1E262B; padding: 10px;">
                                        Banco de proyectos de la Universidad Surcolombiana
                                    </h4>
                                </div>
                                <h5 style="color: #DFD4A6; padding-left:15px; padding-right:15px;">
                                    ${body.mensajeDetalle}
                                </h5>
                            </div>
                        </div>
                    </body>
                </html>`,
                attachments: [{path: path_informefinal}]
            };
            const result = await transporter.sendMail(mailOptions);
            return result;   
        } catch (error) {
            console.log(error);
        }
    }

    sendMail().then((result) => {
        res.status(200).json({
            ok: true,
            mensaje: 'Correro envidado exitosamente',
        });
    }).catch((error) => {
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo enviar el correo',
            err: error
        });
    });
});


app.post('/archivosJurado:idEstudiante', [mdAuth.VerificarToken], (req, res) => {

    const id_estudiante = req.params.idEstudiante;
    const body = req.body;
    const informefinal = id_estudiante+'-documento_informeFinal.pdf';
    const aprobacionEmpresa = id_estudiante+'-documento_aprobacionEmpresa.pdf';
    const path_informefinal = `./uploads/documents/pasantia/${id_estudiante}/${informefinal}`;
    const path_aprobacionEmpresa = `./uploads/documents/pasantia/${id_estudiante}/${aprobacionEmpresa}`;
   
    async function sendMail(){
        try {
            await getCredencialesSMTP();
            const mailOptions = {
                from: 'BPUS <juan.quintero.test@gmail.com>',
                to: body.receptorCorreo,
                subject: body.mensaje,
                text: body.mensajeDetalle,
                html: `<!DOCTYPE html>
                <html lang="es">
                    <head>
                        <style>
                            .container{
                                padding: 3% 25%;
                                background-color:#1E262B;
                            }
                            .msg-container{
                                box-shadow: 
                                    0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                                background-color:#8F141B;
                                border-radius: 5px;
                                padding-top:15px;
                                padding-bottom:1px;    
                            }
                            body{
                                color: #DFD4A6;
                                font-family: 'Open Sans', Arial, Helvetica, sans-serif; 
                            }
                            
                            @media only screen and (max-width: 576px) {
                                .container{
                                    padding:3%;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="msg-container">
                                <div style="text-align:center;">
                                    <img src="https://www.usco.edu.co/imagen-institucional/ocre/universidad-surcolombiana-p.png">
                                    <h4 style="background-color: #DFD4A6; color:#1E262B; padding: 10px;">
                                        Banco de proyectos de la Universidad Surcolombiana
                                    </h4>
                                </div>
                                <h5 style="color: #DFD4A6; padding-left:15px; padding-right:15px;">
                                    ${body.mensajeDetalle}
                                </h5>
                            </div>
                        </div>
                    </body>
                </html>`,
                attachments: [{path: path_informefinal}, {path: path_aprobacionEmpresa}]
            };
            const result = await transporter.sendMail(mailOptions);
            return result;   
        } catch (error) {
            console.log(error);
        }
    }

    sendMail().then((result) => {
        res.status(200).json({
            ok: true,
            mensaje: 'Correro envidado exitosamente',
        });
    }).catch((error) => {
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo enviar el correo',
            err: error
        });
    });
});

app.post('/evaluacion:idEstudiante', [mdAuth.VerificarToken], (req, res) => {

    const id_estudiante = req.params.idEstudiante;
    const body = req.body;
    const jurado = req.query.jurado;
    Pasantia.find({estudiante: id_estudiante}, (err, pasantia)=>{ 
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else {
            var evaluacionJurado;
            if(pasantia[0].jurado1 == jurado){
                evaluacionJurado = id_estudiante+'-documento_evaluacion_jurado1.pdf';            
            }else if(pasantia[0].jurado2 == jurado){
                evaluacionJurado = id_estudiante+'-documento_evaluacion_jurado2.pdf';
            }
            const path_evaluacionJurado = `./uploads/documents/pasantia/${id_estudiante}/${evaluacionJurado}`;
            
            async function sendMail(){
                try {
                    await getCredencialesSMTP();
                    const mailOptions = {
                        from: 'BPUS <juan.quintero.test@gmail.com>',
                        to: body.receptorCorreo,
                        subject: body.mensaje,
                        text: body.mensajeDetalle,
                        html: `<!DOCTYPE html>
                        <html lang="es">
                            <head>
                                <style>
                                    .container{
                                        padding: 3% 25%;
                                        background-color:#1E262B;
                                    }
                                    .msg-container{
                                        box-shadow: 
                                            0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                                        background-color:#8F141B;
                                        border-radius: 5px;
                                        padding-top:15px;
                                        padding-bottom:1px;    
                                    }
                                    body{
                                        color: #DFD4A6;
                                        font-family: 'Open Sans', Arial, Helvetica, sans-serif; 
                                    }
                                    
                                    @media only screen and (max-width: 576px) {
                                        .container{
                                            padding:3%;
                                        }
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <div class="msg-container">
                                        <div style="text-align:center;">
                                            <img src="https://www.usco.edu.co/imagen-institucional/ocre/universidad-surcolombiana-p.png">
                                            <h4 style="background-color: #DFD4A6; color:#1E262B; padding: 10px;">
                                                Banco de proyectos de la Universidad Surcolombiana
                                            </h4>
                                        </div>
                                        <h5 style="color: #DFD4A6; padding-left:15px; padding-right:15px;">
                                            ${body.mensajeDetalle}
                                        </h5>
                                    </div>
                                </div>
                            </body>
                        </html>`,
                        attachments: [{path: path_evaluacionJurado}]
                    };
                    const result = await transporter.sendMail(mailOptions);
                    return result;   
                } catch (error) {
                    console.log(error);
                }
            }
        
            sendMail().then((result) => {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Correro envidado exitosamente',
                });
            }).catch((error) => {
                res.status(500).json({
                    ok: false,
                    mensaje: 'No se pudo enviar el correo',
                    err: error
                });
            });
        }
    });
})

app.post('/correo/proyecto/:nombreArchivo', [mdAuth.VerificarToken], (req,res) => {
    const id_proyecto = req.query.idProyecto;
    const body = req.body;
    const nombreArchivo = req.params.nombreArchivo;
    const path = `./uploads/documents/proyectos/${id_proyecto}/${nombreArchivo}`;

    async function sendMail(){
        try {
            await getCredencialesSMTP();
            const mailOptions = {
                from: 'BPUS <juan.quintero.test@gmail.com>',
                to: body.receptorCorreo,
                subject: body.mensaje,
                text: body.mensajeDetalle,
                html: `<!DOCTYPE html>
                <html lang="es">
                    <head>
                        <style>
                            .container{
                                padding: 3% 25%;
                                background-color:#1E262B;
                            }
                            .msg-container{
                                box-shadow: 
                                    0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                                background-color:#8F141B;
                                border-radius: 5px;
                                padding-top:15px;
                                padding-bottom:1px;    
                            }
                            body{
                                color: #DFD4A6;
                                font-family: 'Open Sans', Arial, Helvetica, sans-serif; 
                            }
                            
                            @media only screen and (max-width: 576px) {
                                .container{
                                    padding:3%;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="msg-container">
                                <div style="text-align:center;">
                                    <img src="https://www.usco.edu.co/imagen-institucional/ocre/universidad-surcolombiana-p.png">
                                    <h4 style="background-color: #DFD4A6; color:#1E262B; padding: 10px;">
                                        Banco de proyectos de la Universidad Surcolombiana
                                    </h4>
                                </div>
                                <h5 style="color: #DFD4A6; padding-left:15px; padding-right:15px;">
                                    ${body.mensajeDetalle}
                                </h5>
                            </div>
                        </div>
                    </body>
                </html>`,
                attachments: [{path: path}]
            };
            const result = await transporter.sendMail(mailOptions);
            return result;   
        } catch (error) {
            console.log(error);
        }
    }

    sendMail().then((result) => {
        res.status(200).json({
            ok: true,
            mensaje: 'Correro envidado exitosamente',
        });
    }).catch((error) => {
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo enviar el correo',
            err: error
        });
    });

});

module.exports = app;