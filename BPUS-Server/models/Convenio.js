var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var convenioSchema = new Schema({
    
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'Empresa' },
    programa: { type: Schema.Types.ObjectId, required: true, ref: 'Programa' },
    encargado: { type: Schema.Types.ObjectId, ref: 'Administrativo', required: true },
    rutapdf: { type: String, required: false },
    estado: { type: String, required: true },

}, { collection: 'convenios' });

module.exports = mongoose.model('convenio', convenioSchema);