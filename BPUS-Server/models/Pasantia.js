var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PasantiaSchema = new Schema({

    estudiante: { type: Schema.Types.ObjectId, required: true, ref: 'Estudiante'},
    programa: { type: Schema.Types.ObjectId, required: true, ref: 'Programa'},
    aprobacionEmpresa: { type: Boolean, required: true, default: false },
    lineaInvestigacion: { type: Schema.Types.ObjectId, required: true, ref: 'lineaInvestigacion' },
    titulo: {type:String, required:false},
    descripcion: {type:String, required:false},
    convenio: { type: Schema.Types.ObjectId, required: false, ref: 'convenio' },
    vacante: { type: Schema.Types.ObjectId, required: false, ref: 'Vacante' },
    tutor: { type: Schema.Types.ObjectId, required: false, ref: 'Administrativo' },

    documento_propuesta: { type: String, required: false },
    documento_fichaAcademica: { type: String, required: false },
    carta_presentacion: { type: String, required: false },
    estado_propuesta: { type: String, required: false },
    notas_propuesta: { type: String, required: false },

    documento_arl: { type: String, required: false },
    fecha_arl:{ type: Date, required: false },

    documento_actaInicio: { type: String, required: false },
    fecha_actaInicio:{ type: Date, required: false },
    estado_actaInicio: { type: String, required: false },
    notas_actaInicio:{ type: String, required: false },

    documento_informe7: { type: String, required: false },
    estado_informe7: { type: String, required: false },
    notas_informe7: { type: String, required: false },

    documento_informe14: { type: String, required: false },
    estado_informe14: { type: String, required: false },
    notas_informe14: { type: String, required: false },

    documento_informeFinal: { type: String, required: false },
    documento_aprobacionEmpresa: { type: String, required: false },
    estado_informeFinal: { type: String, required: false },
    notas_informeFinal: { type: String, required: false },

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

}, { collection: 'pasantias' });

// Exportamos el modelo
module.exports = mongoose.model('Pasantia', PasantiaSchema);