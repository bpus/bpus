var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lineaInvestigacionSchema = new Schema({
    
    nombre: { type: String, required: true },
    programa: { type: Schema.Types.ObjectId, required: true, ref: 'Programa' },
    estado: { type: Boolean, required: true, default: true },

}, { collection: 'lineasInvestigacion' });

module.exports = mongoose.model('lineaInvestigacion', lineaInvestigacionSchema);