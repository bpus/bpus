var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var vacantesSchema = new Schema({

    titulo: { type: String, required: true },
    funciones: { type: String, required: true },
    descripcion: { type: String, required: true },
    convenio: { type: Schema.Types.ObjectId, ref: 'convenio', required: true },
    ubicacion: { type: String, required: true },
    modalidad: { type: String, required: true },
    cantidad: { type: Number, required: true },
    pagada: { type: String, required: true },
    estado: { type: Boolean, required: true, default:true }

}, { collection: 'vacantes' });

module.exports = mongoose.model('Vacante', vacantesSchema);
