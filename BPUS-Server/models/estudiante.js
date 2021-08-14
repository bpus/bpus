var mongoose = require('mongoose');

var Schema = mongoose.Schema;


// Creamos el esquema de la colección estudiantes para guardar en mongo
var estudianteSchema = new Schema({

    codigo: { type: String, required: true },
    identificacion: { type: String, required: true },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: false },
    programa: { type: Schema.Types.ObjectId, required: true, ref: 'Programa' },
    creditos_aprobados: { type: Number, required: true },
    usuario: { type: String, required: true },
    eps: { type: String, required: false },
    contraseña: { type: String, required: true },
    rol: { type: Schema.Types.ObjectId, required: true, ref: 'Roles' },
    modalidad: { type: Schema.Types.ObjectId, refPath: 'onModel', required: false },
    onModel: {type: String, required: false, enum: ['Pasantia','Proyecto']}

});

// Exportamos el modelo
module.exports = mongoose.model('Estudiante', estudianteSchema);