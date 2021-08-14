var mongoose = require('mongoose');

var Schema = mongoose.Schema;


// Creamos el esquema de la colección modalidades para guardar en mongo
var modalidadSchema = new Schema({

    nombre: { type: String, required: true },
    porcentaje_creditos: { type: Number, required: true },
    url: { type: String, required: true }

}, { collection: 'modalidades' });

// Exportamos el modelo
module.exports = mongoose.model('Modalidad', modalidadSchema);