var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProyectoSchema = new Schema({

    estudiante: { type: Schema.Types.ObjectId, required:true, ref: 'Estudiante'},
    programa: { type: Schema.Types.ObjectId, required: true, ref: 'Programa' },
    lineaInvestigacion: { type: Schema.Types.ObjectId, required: true, ref: 'lineaInvestigacion' },
    titulo: {type:String, required:true},
    director: { type: Schema.Types.ObjectId, required:true, ref: 'Administrativo' },
    estudiante2: { type: Schema.Types.ObjectId, required: false, ref: 'Estudiante'},
    aprobacionEstudiante2: {type: Boolean, required:false},
    estudiante3: { type: Schema.Types.ObjectId, required: false, ref: 'Estudiante'},
    aprobacionEstudiante3: {type: Boolean, required:false },
    documento_fichaAcademica: { type: String, required: false },
    documento_fichaAcademica2: { type: String, required: false },
    documento_fichaAcademica3: { type: String, required: false },


    documento_propuesta: { type: String, required: false },
    notas_propuesta: { type: String, required: false },
    estado_propuesta: { type: String, required: false },

    fecha_aprobacion: {type: Date, required:false},

    documento_anteproyecto: { type: String, required: false },
    notas_anteproyecto: { type: String, required: false },
    estado_anteproyecto: { type: String, required: false },

    documento_proyecto: { type: String, required: false },
    notas_proyecto: { type: String, required: false },
    estado_proyecto: { type: String, required: false },

    jurado1: { type: Schema.Types.ObjectId, required: false, ref: 'Administrativo' },
    evaluacion_jurado1: { type: String, required: false },
    documento_evaluacion_jurado1: { type: String, required: false },
    notas_jurado1: { type: String, required: false },

    jurado2: { type: Schema.Types.ObjectId, required: false, ref: 'Administrativo' },
    evaluacion_jurado2: { type: String, required: false },
    documento_evaluacion_jurado2: { type: String, required: false },
    notas_jurado2: { type: String, required: false },

    sustentacion_fecha: { type: Date, required: false },
    sustentacion_lugar: { type: String, required: false },

    estado: { type: String, required: false },

}, { collection: 'proyectos' });

// Exportamos el modelo
module.exports = mongoose.model('Proyecto', ProyectoSchema);