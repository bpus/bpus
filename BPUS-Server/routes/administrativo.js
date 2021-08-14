var express = require('express');
var app = express();
var Administrativo = require('../models/administrativo');
var mdAuth = require('../middlewares/autenticacion');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

/* ====================================================
                GET Administrativos
=======================================================*/

app.get('/', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    var desde= req.query.desde || 0;
    desde = Number(desde);
    const campo = req.query.campo;
    Administrativo.find({}, '_id identificacion nombres apellidos correo telefono programa cargo estado rol').skip(desde).limit(10).sort({campo: 1}).populate('rol').populate('programa').exec((err, admins) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'Hubo un error!'
            });
        } else {
            Administrativo.countDocuments({},(err,conteo)=>{
                if (err) {
                    res.status(500).json({
                        ok: true,
                        mensaje: 'Lo sentimos, ocurrió un error'
                    });
                }else{ 
                    res.status(200).json({
                        ok:true,
                        mensaje: 'Petición realizada correctamente',
                        admins: admins,
                        total:conteo
                    });
                }
            }); 
        }
    });
});

/* ====================================================
                GET docentes
=======================================================*/

app.get('/docentes', [mdAuth.VerificarToken], (req, res) => {

    Administrativo.find({rol: {$nin: ['60b66f2b5756933d5096d51a', '60c76753ae3c10683ffc6b28']}},
     'identificacion nombres apellidos correo telefono programa cargo estado rol', (err, docentes) => { 
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'Hubo un error!'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                docentes: docentes
            });
        }
    });
});


/* ====================================================
                GET docentes por programa
=======================================================*/

app.get('/:idPrograma', [mdAuth.VerificarToken], (req, res) => {

    var idPrograma = req.params.idPrograma;

    Administrativo.find({ programa: idPrograma, rol: {$nin: ['60b66f2b5756933d5096d51a']}}, 'identificacion nombres apellidos correo telefono programa cargo estado rol' , (err, admins) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'Hubo un error!'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                admins: admins
            });
        }
    });
});

/* ====================================================
                    POST Admin
=======================================================*/
app.post('/', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    var body = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.identificacion, salt);
    body.contraseña = hash;

    const admin = new Administrativo(body);

    admin.save((err, adminGuardado) => {
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
});

/* ====================================================
                    POST EncargadoEmpresa
=======================================================*/
app.post('/encargado', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {
    var body = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.identificacion, salt);

    var encargadoEmpresa = new Administrativo({
        identificacion: body.identificacion,
        nombres: body.nombres,
        apellidos: body.apellidos,
        correo: body.correo,
        telefono: body.telefono,
        contraseña: hash,
        cargo: body.cargo,
        rol: body.rol,
    });

    encargadoEmpresa.save((err, encargadoEmpresaGuardado) => {

        if (err) {
            console.log(err)
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                encargadoEmpresaGuardado: encargadoEmpresaGuardado
            });
        }
    });

    async function sendMail(){
        try {
            const transporter = nodemailer.createTransport({
                service: "smtp-mail.outlook.com",
                host: 587,
                secureConnection: false,
                auth: {
                    user: "no-reply-bpus@outlook.es",
                    pass: "TesisAngelCruel#01"
                },
                tls: {
                    ciphers:'SSLv3'
                }
            });
            const mailOptions = {
                from: 'BPUS <juan.quintero.test@gmail.com>',
                to: body.correo,
                subject: 'Bienvenido a BPUS',
                text: 'Podras acceder a la plataforma usando tu cedula:'+body.identificacion+', y tu contraseña es: '+body.identificacion
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

/* ====================================================
                    PUT Admin
=======================================================*/
app.put('/adminPut', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    const body = req.body;
    Administrativo.findById(req.body._id, (err, administrativo) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!administrativo) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ningún admin',
                err: err
            });
        }else{
            administrativo.identificacion = body.identificacion;
            administrativo.nombres = body.nombres;
            administrativo.apellidos = body.apellidos;
            administrativo.correo = body.correo;
            administrativo.telefono =  body.telefono;
            if(administrativo.programa && !body.programa){
                administrativo.programa = undefined;
            }
            if(body.programa && administrativo.cargo){
                administrativo.cargo = undefined;
                administrativo.programa = body.programa;
            }else if(body.programa){
                administrativo.programa = body.programa;
            }
            if(body.cargo && administrativo.programa){
                administrativo.programa = undefined;
                administrativo.cargo = body.cargo;
            }else if(body.cargo){
                administrativo.cargo = body.cargo;
            }
            administrativo.rol = body.rol;
            administrativo.save((err, adminEditado) => {
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

app.put('/putEncargado/:id', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req,res) =>{
    Administrativo.findByIdAndUpdate(req.params.id, req.body, (err,adminEditado) =>{
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        }else if(!adminEditado){
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, no se econtro ningún encargado',
            });
        }else{
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
            });
        }
    });
});

/* ====================================================
                Cambiar estado Admin
=======================================================*/
app.put('/cambiarEstado', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    Administrativo.findById(req.body._id, (err, administrativo) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!administrativo) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });
        }else{
            administrativo.estado = req.body.estado;
            administrativo.save((err, adminEditado) => {
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
                   Delete ADMIN
=======================================================*/
app.delete('/:id', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req, res) => {
    
    const id = req.params.id;
    Administrativo.findByIdAndRemove(id, (err, administrativoEliminado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!administrativoEliminado) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna admin',
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
                    Cambiar clave
=======================================================*/
app.put('/cambiarclave', mdAuth.VerificarToken, (req, res) => {
    Administrativo.findById(req.body.usuario, (err, administrativo) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });
        } else if (!administrativo) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });
        }else{
            const salt = bcrypt.genSaltSync(10);
            const pass = req.body.clave;
            const hash = bcrypt.hashSync(pass, salt);
            administrativo.contraseña = hash
            administrativo.save((err, administrativoSave) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Lo sentimos, ocurrió un error',
                        err: err
                    });
                }else{
                    delete req.usuario.password;
                    var token = jwt.sign({usuario: req.usuario},SEED,{expiresIn:14400}); // 4 horas y luego expirara el token.
                    const menu = obtenerMenu(req.usuario.rol.nombre);
                    res.status(200).json({
                        ok: true,
                        token:token,
                        menu: menu
                    });
                }
            });
        }
    });
});

app.put('/telefono', mdAuth.VerificarToken, (req,res) => {
    if(req.body.usuario === req.usuario._id){
        Administrativo.findById(req.body.usuario, (err, administrativo) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ocurrió un error',
                    err: err
                });
            } else if (!administrativo) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontró ninguna solicitud',
                    err: err
                });
            }else{
                administrativo.telefono = req.body.telefono;
                administrativo.save((err, administrativoSave) => {
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