var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Creamos el esquema de la colección administrativos para guardar en mongo
var administrativoSchema = new Schema({

    identificacion: { type: String, required: true, unique: true },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    correo: { type: String, required: true, unique:true },
    telefono: { type: String, required: true },
    programa: { type: Schema.Types.ObjectId, required: false, ref: 'Programa' },
    cargo: {type: String, required: false},
    contraseña: { type: String, required: true },
    rol: { type: Schema.Types.ObjectId, required: true, ref: 'Roles' },
    estado: {type: Boolean, required:true, default: true}

});

// Exportamos el modelo
module.exports = mongoose.model('Administrativo', administrativoSchema);
