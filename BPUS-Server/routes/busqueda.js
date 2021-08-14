var express = require('express');
var app= express();
var mdAuth = require('../middlewares/autenticacion');
const Administrativo = require('../models/administrativo');
const Convenio = require('../models/Convenio');
const Empresa = require('../models/Empresa');
const Estudiante = require('../models/estudiante');
const Modalidad = require('../models/modalidad');
const Pasantia = require('../models/Pasantia');
const Permisos = require('../models/permisos');
const Vacante = require('../models/Vacante');

//===============================================
//  Busqueda por coleccion- metodo get
//===============================================


app.get('/coleccion/:tabla/:busqueda', [mdAuth.VerificarToken], (req,res,next)=>{

    var tabla = req.params.tabla;
    var busqueda= req.params.busqueda;
    var num = parseInt(busqueda) || 0;
    var regex= new RegExp(busqueda,'i'); //Expresion regular.
    var promesa;

    switch (tabla) {
        case 'administrativo':
            promesa=  buscarAdministrativo(regex);
            break;
        case 'empresa':
            promesa=  buscarEmpresa(regex);
            break;
        case 'estudiante':
            promesa=  buscarEstudiante(num, regex, req.query.programa);
            break;
        case 'modalidad':
            promesa=  buscarEmpresa(regex);
            break; 
        case 'permisos':
            promesa=  buscarEmpresa(regex);
            break;
        case 'programa':
            promesa=  buscarEmpresa(regex);
            break;
        case 'vacante':
            promesa=  buscarEmpresa(regex);
            break;                   
        default:
            res.status(400).json({
                ok:false,
                mensaje:'Los tipos de busqueda solo son: usuarios,medicos,hospitales',
                error:{ message: 'Tipo de tabla/coleccion no valido.'}
            });
        break;
    }

    promesa.then(data =>{
        res.status(200).json({
            ok:true,
            [tabla]:data  //Propiedad de objetos computadas.
        });
    });
    
});


//===============================================
//  Funciones de busquedas.
//===============================================

function buscarAdministrativo(regex){
    return new Promise((resolve,reject)=>{
        Administrativo.find({}, 'identificacion nombres apellidos correo telefono programa cargo estado rol')
        .or([ {'identificacion':regex}, {'nombres':regex}, {'apellidos':regex}, {'telefono':regex}, {'correo':regex}, {'cargo': regex}])
        .populate('rol programa').exec((err,usuarios)=>{
            if(err){
                reject('Error al cargar los usuarios',err);
            }else{
                resolve(usuarios);
            }
        });
    });
}

function buscarEmpresa(regex){
    return new Promise((resolve,reject)=>{
        Empresa.find({},)
        .or([ {'nit':regex}, {'nombre':regex}, {'direccion':regex}, {'telefono':regex}, {'correo':regex}, {'naturaleza': regex}, {'actividad_economica': regex}])
        .exec((err,empresas)=>{
            if(err){
                reject('Error al cargar los usuarios',err);
            }else{
                resolve(empresas);
            }
        });
    });
}

function buscarEstudiante(num, regex, programa){
    return new Promise((resolve,reject)=>{
        Estudiante.find({programa:programa}, 'nombres apellidos correo creditos_aprobados codigo identificacion telefono')
        .or([ {'identificacion':regex}, {'nombres':regex}, {'apellidos':regex}, {'telefono':regex}, {'codigo': regex}, {'correo':regex}, {'creditos_aprobados': num}])
        .exec((err,usuarios)=>{
            if(err){
                console.log(err)
                reject('Error al cargar los usuarios',err);
            }else{
                resolve({usuarios: usuarios, conteo: usuarios.length});
            }
        });
    });
}

module.exports= app;