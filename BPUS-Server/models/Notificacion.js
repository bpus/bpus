var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var notificacionSchema = new Schema({

    receptor: { type: Schema.Types.ObjectId, refPath: 'onModel', required: true },
    fecha: { type: Date, required: true },
    mensaje: { type: String, required: true },
    mensajeDetalle: { type: String, required: true },
    isRead: { type: Boolean, required: true, default:false },
    onModel: {type: String, required: true, enum: ['Estudiante', 'Administrativo']}

}, { collection: 'notificaciones' });

module.exports = mongoose.model('Notificacion', notificacionSchema);