var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Creamos el esquema de la colección administrativos para guardar en mongo
var credencialesSMTPSchema = new Schema({

    user: { type: String, required: true},
    pass: { type: String, required: true},
    estado: {type: Boolean, required:true, default: true}

}, { collection: 'credencialesSMTP' });

// Exportamos el modelo
module.exports = mongoose.model('credencialesSMTP', credencialesSMTPSchema);