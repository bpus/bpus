var express = require('express');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var bcrypt = require('bcryptjs');

var cors = require('cors')
 
var corsOptions = {
  origin: 'http://localhost:4200', //https://bpus-316916.web.app
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Importamos los modelos
var Estudiante = require('../models/estudiante');
var Administrativo = require('../models/administrativo');
var nodemailer = require('nodemailer');
const credencialesSMTP = require('../models/credencialesSMTP');
var app = express();
//===============================================
//  Login
//===============================================
app.post('/', (req, res) => {

    var body = req.body;

    // Se captura el usuario y contraseña
    var usuario = body.usuario;
    var contrasena = body.contrasena;

    // Revisamos que el usuario digitado sea un estudiante (tiene una 'u') o administrativo
    var ifEstudiante = usuario.indexOf('u');

    // Si es un estudiante...
    if (ifEstudiante >= 0) {
        // Accedemos al servicio que regresa los estudiantes enviando el usuario
        Estudiante.findOne({ usuario: usuario }).populate('rol')
        .populate({path :'modalidad', populate: {path: 'director estudiante estudiante2 estudiante3', populate:{path:'programa', select:'nombre'}, select:'programa nombres apellidos correo'}})
        .lean().exec((err, estudianteEncotrado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, hubo un problema en el servidor'
                });
            }
            else{
                if (estudianteEncotrado != null) { 
                    if (!bcrypt.compareSync(contrasena, estudianteEncotrado.contraseña)) {
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Contraseña Incorrecta'
                        });
                        // Si todo sale bien...
                    } else {
                        if(contrasena == estudianteEncotrado.identificacion){
                            delete estudianteEncotrado.contraseña;
                            estudianteEncotrado.password = "$Pl3aSeC4mbI3D3clV3#&";
                            delete estudianteEncotrado.rol.estado;
                            delete estudianteEncotrado.estado;
                            delete estudianteEncotrado.__v;
                            delete estudianteEncotrado.usuario;
                            var modalidad = "No tiene modalidad"; 
                            if(estudianteEncotrado.modalidad){
                                modalidad = estudianteEncotrado.modalidad;
                                estudianteEncotrado.modalidad = estudianteEncotrado.modalidad._id;
                            }
                            var token = jwt.sign({ usuario: estudianteEncotrado }, SEED, { expiresIn: "10m" });
                            res.status(200).json({
                                ok: true,
                                mensaje: "Login Correcto",
                                token: token,
                                modalidad: modalidad
                            });
                        }else{
                            // Se crea un token para validar la autenticacíon del estudiante
                            delete estudianteEncotrado.contraseña;
                            delete estudianteEncotrado.rol.estado;
                            delete estudianteEncotrado.estado;
                            delete estudianteEncotrado.__v;
                            delete estudianteEncotrado.usuario;
                            var modalidad = "No tiene modalidad"; 
                            if(estudianteEncotrado.modalidad){
                                modalidad = estudianteEncotrado.modalidad;
                                estudianteEncotrado.modalidad = estudianteEncotrado.modalidad._id;
                            }
                            var token = jwt.sign({ usuario: estudianteEncotrado }, SEED, { expiresIn: "3h" });
                            // Finalmente se hace una respuesta, con la info del estudiante y el token
                            res.status(200).json({
                                ok: true,
                                mensaje: "Login Correcto",
                                token: token,
                                modalidad: modalidad
                            });
                        }
                    }
                } else {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Usuario incorrecto'
                    });
                }
            }
        });    
    // Si no es estudiante, es administrativo :v --> Parte administrativo
    } else {
        // Accedemos al servicio que regresa los administrativos enviando el usuario
        Administrativo.findOne({ identificacion: usuario }).populate('rol').lean().exec((err, adminEncontrado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, hubo un problema en el servidor'
                });
            } else{
                if(adminEncontrado != null){
                    if(adminEncontrado.estado == true){
                        // Comparamos las contraseñas, si no son iguales...
                        if (!bcrypt.compareSync(contrasena, adminEncontrado.contraseña)) {
                            res.status(500).json({
                                ok: false,
                                mensaje: 'Contraseña Incorrecta'
                            });
                        // Finalmente si todo sale bien...
                        } else {
                            if(contrasena == adminEncontrado.identificacion){
                                adminEncontrado.password = "$Pl3aSeC4mbI3D3clV3#&";
                                delete adminEncontrado.rol.estado;
                                delete adminEncontrado.estado;
                                delete adminEncontrado.__v;
                                delete adminEncontrado.contraseña;
                                var token = jwt.sign({ usuario: adminEncontrado }, SEED, { expiresIn: 600 });
                                res.status(200).json({
                                    ok: true,
                                    mensaje: "Login Correcto",
                                    token: token
                                });
                            }else{
                                // Se crea un token para validar la autenticacíon del administrativo
                                delete adminEncontrado.contraseña;
                                delete adminEncontrado.rol.estado;
                                delete adminEncontrado.estado;
                                delete adminEncontrado.__v;
                                var token = jwt.sign({ usuario: adminEncontrado }, SEED, { expiresIn: 14400 });
                                const menu = obtenerMenu(adminEncontrado.rol.nombre);
                                // Finalmente se hace una respuesta, con la info del administrativo y el token
                                res.status(200).json({
                                    ok: true,
                                    mensaje: "Login Correcto",
                                    token: token,
                                    menu: menu
                                });   
                            }
                        }
                    }else{
                        res.status(500).json({
                            ok: false,
                            mensaje: 'El usuario no se encuentra activado'
                        });
                    }
                }else{
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Usuario incorrecto'
                    });
                }
            }
        });
    }
});

//===============================================
// Olvido de clave
//===============================================
app.post('/olvidoClave', cors(corsOptions), (req, res) => {
    if(req.body.perfil === 'Estudiante'){
        Estudiante.findOne({ usuario: req.body.usuario },'nombres apellidos usuario correo codigo -_id', (err, estudiante) => {
            if(err){
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, hubo un problema en el servidor',
                    error: err
                });
            }else if(!estudiante){
                res.status(500).json({
                    ok: false,
                    mensaje: 'Usuario incorrecto'
                });
            }else{
                if(req.body.correo !== estudiante.correo){
                    res.status(500).json({
                        ok: false,
                        mensaje: 'El correro ingresado no se corresponde con el registrado.'
                    });
                }else{
                    var user = "";
                    var pass = "";
                    var transporter;
                    var token = jwt.sign({ usuario: estudiante }, SEED, { expiresIn: '1h' });

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

                    async function sendMail(){
                        try {
                            await getCredencialesSMTP();
                            const mailOptions = {
                                from: 'BPUS <juan.quintero.test@gmail.com>',
                                to: req.body.correo,
                                subject: 'Cambio de contraseña',
                                text: `Ingresa a esta direccion https://bpus-316916.web.app/cambio-contraseña/${token} y cambia la contraseña. Este link tiene una validez de 1 hora`,
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
                                                font-family: 'Open Sans', Arial, Helvetica, sans-serif;
                                                line-height: 1.6; 
                                            }
                                            .button {
                                                background-color: #4D626C;
                                                border: none;
                                                color: #F9F6ED;
                                                padding: 10px 20px;
                                                text-align: center;
                                                text-decoration: none;
                                                display: inline-block;
                                                font-size: 16px;
                                                margin: 4px 2px;
                                                cursor: pointer;
                                                -webkit-transition-duration: 0.4s; /* Safari */
                                                transition-duration: 0.4s;
                                            }
                                
                                
                                            .button:hover {
                                                background-color: #DFD4A6;
                                                color: #1E262B;
                                                box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19);
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
                                                    <h3 style="background-color: #DFD4A6; color:#1E262B; padding: 10px;">
                                                        Banco de proyectos de la Universidad Surcolombiana
                                                    </h3>
                                                </div>
                                                <h4 style="color: #F9F6ED; padding-left:15px; padding-right:15px;">
                                                    Se solicitó un restablecimiento de contraseña para tu cuenta, haz clic en el botón que aparece a continuación para cambiar tu contraseña.
                                                </h4>
                                                <div style="text-align:center;">
                                                    <a class="button" href="https://bpus-316916.web.app/cambio-contraseña/${token}" target="_blank">Cambiar contraseña</a>
                                                </div>
                                                <br>
                                                <h4 style="color: #F9F6ED; padding-left:15px; padding-right:15px;">
                                                    Si tu no realizaste la solicitud de cambio de contraseña, solo ignora este mensaje.
                                                </h4>
                                                <h4 style="color: #F9F6ED; padding-left:15px; padding-right:15px;">
                                                    Este enlace solo es válido dentro de los proximos 60 minutos.
                                                </h4>
                                                <p style="color: #F9F6ED; padding-left:15px; padding-right:15px;">
                                                    Si tienes problemas dando click al botón "Cambiar conntraseña", copia y pega el siguiente enlace en tu navegador: 
                                                <span style="text-decoration: underline; color:#A6B1B6">https://bpus-316916.web.app/cambio-contraseña/${token}</span>
                                            </p>
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
                }
            }
        })
    }else{
        Administrativo.findOne({identificacion: req.body.usuario}, 'nombres apellidos identificacion correo estado -_id', (err, admin) => {
            if(err){
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, hubo un problema en el servidor',
                    error: err
                });
            }else if(!admin){
                res.status(500).json({
                    ok: false,
                    mensaje: 'Usuario incorrecto'
                });
            }else{
                if(admin.estado === true){
                    if(req.body.correo !== admin.correo){
                        res.status(500).json({
                            ok: false,
                            mensaje: 'El correro ingresado no se corresponde con el registrado.'
                        });
                    }else{
                        var user = "";
                        var pass = "";
                        var transporter;
                        var token = jwt.sign({ usuario: admin }, SEED, { expiresIn: '1h' });

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
    
                        async function sendMail(){
                            try {
                                await getCredencialesSMTP();
                                const mailOptions = {
                                    from: 'BPUS <juan.quintero.test@gmail.com>',
                                    to: req.body.correo,
                                    subject: 'Cambio de contraseña',
                                    text: `Ingresa a esta direccion https://bpus-316916.web.app/cambio-contraseña/${token} y cambia la contraseña. Este link tiene una validez de 1 hora`,
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
                                                    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
                                                    line-height: 1.6; 
                                                }
                                                .button {
                                                    background-color: #4D626C;
                                                    border: none;
                                                    color: #F9F6ED;
                                                    padding: 10px 20px;
                                                    text-align: center;
                                                    text-decoration: none;
                                                    display: inline-block;
                                                    font-size: 16px;
                                                    margin: 4px 2px;
                                                    cursor: pointer;
                                                    -webkit-transition-duration: 0.4s; /* Safari */
                                                    transition-duration: 0.4s;
                                                }
                                    
                                    
                                                .button:hover {
                                                    background-color: #DFD4A6;
                                                    color: #1E262B;
                                                    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19);
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
                                                        <h3 style="background-color: #DFD4A6; color:#1E262B; padding: 10px;">
                                                            Banco de proyectos de la Universidad Surcolombiana
                                                        </h3>
                                                    </div>
                                                    <h4 style="color: #F9F6ED; padding-left:15px; padding-right:15px;">
                                                        Se solicitó un restablecimiento de contraseña para tu cuenta, haz clic en el botón que aparece a continuación para cambiar tu contraseña.
                                                    </h4>
                                                    <div style="text-align:center;">
                                                        <a class="button" href="https://bpus-316916.web.app/cambio-contraseña/${token}" target="_blank">Cambiar contraseña</a>
                                                    </div>
                                                    <br>
                                                    <h4 style="color: #F9F6ED; padding-left:15px; padding-right:15px;">
                                                        Si tu no realizaste la solicitud de cambio de contraseña, solo ignora este mensaje.
                                                    </h4>
                                                    <h4 style="color: #F9F6ED; padding-left:15px; padding-right:15px;">
                                                        Este enlace solo es válido dentro de los proximos 60 minutos.
                                                    </h4>
                                                    <p style="color: #F9F6ED; padding-left:15px; padding-right:15px;">
                                                        Si tienes problemas dando click al botón "Cambiar conntraseña", copia y pega el siguiente enlace en tu navegador: 
                                                    <span style="text-decoration: underline; color:#A6B1B6">https://bpus-316916.web.app/cambio-contraseña/${token}</span>
                                                </p>
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
                    }
                }else{
                    res.status(500).json({
                        ok: false,
                        mensaje: 'El usuario no se encuentra activado'
                    });
                }
            }
        });
    }
});

function obtenerMenu(ROLE) {

    var menu;

    if(ROLE == "JEFE_PROGRAMA"){
        menu = [
            { titulo: 'Propuestas',  icono: 'fa fa-file-pdf-o', url: '/propuestas' },
            { titulo: 'Tutorias asignadas', icono: 'fa fa-book', url: '/tutorias-asignadas' },
            { titulo: 'Sustentaciones', icono: 'fa fa-calendar', url: '/asignacion-sustentacion' },
            { titulo: 'Jurado',  icono: 'fa fa-legal', url: '/jurado' },
            { titulo: 'Gestión de Empresas', icono: 'fa fa-building', url: '/empresas' },
            { titulo: 'Líneas de investigación', icono: 'fa fa-lightbulb-o', url: '/gestion-lineas-investigacion'},
            { titulo: 'Gestión de estudiantes', icono: 'fa fa-group', url: '/gestion-estudiantes'},
            { titulo: 'Informes', icono: 'fa fa-pie-chart', url: '/gestion-modalidades'},
        ];
    }
    else if(ROLE == "ADMIN"){
        menu= [
            { titulo: 'Administrativos', icono: 'fa fa-user', url: '/admin-administrativos'},
            { titulo: 'Convenios', icono: 'fa fa-briefcase', url: '/admin-convenios' },
            { titulo: 'Empresas', icono: 'fa fa-building', url: '/admin-empresas' },
            { titulo: 'Líneas de investigación', icono: 'fa fa-lightbulb-o', url: '/admin-lineas-investigacion'},
            { titulo: 'Modalidades', icono: 'fa fa-graduation-cap', url: '/admin-modalidades' },
            { titulo: 'Programas', icono: 'fa fa-university', url: '/admin-programas' },
            { titulo: 'Permisos', icono: 'fa fa-shield', url: '/permisos' },
            { titulo: 'Roles', icono: 'fa fa-group', url: '/roles' },
            { titulo: 'Credienciales SMTP', icono: 'fa fa-envelope', url: '/credenciales-smtp'}
        ];
    }else if(ROLE == "ENCARGADO_EMPRESA"){
        menu = [
            { titulo: 'Gestión de solicitudes', icono: 'fa fa-envelope-open', url: '/solicitud-vacantes' },
            { titulo: 'Gestión Vacantes', icono: 'fa fa-briefcase', url: '/vacantes'}
        ];
    }else if (ROLE == "PROFESOR"){
        menu = [
            { titulo: 'Tutorias asignadas', icono: 'fa fa-book', url: '/tutorias-asignadas' },
            { titulo: 'Jurado',  icono: 'fa fa-legal', url: '/jurado' },
        ];
    }
    return menu;
}

module.exports = app;