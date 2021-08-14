var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var empresaSchema = new Schema({

    nit: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    ciudad: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String, required: true },
    naturaleza: { type: String, required: true },
    actividad_economica: { type: String, required: true },
    estado: { type: Boolean, required: true, default:true}

}, { collection: 'empresas' });

module.exports = mongoose.model('Empresa', empresaSchema);