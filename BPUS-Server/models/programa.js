var mongoose = require('mongoose');

var Schema = mongoose.Schema;


// Creamos el esquema de la colección programas para guardar en mongo
var programaSchema = new Schema({

    nombre: { type: String, required: true },
    creditos_totales: { type: Number, required: true },
    jefe: { type: Schema.Types.ObjectId, required: true, ref: 'Administrativo'}

}, { collection: 'programas' });

// Exportamos el modelo
module.exports = mongoose.model('Programa', programaSchema);