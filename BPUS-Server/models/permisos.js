var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var permisosSchema = new Schema({
    nombre:{type: String, required: true},
    pagina: {type: String, required: true},
    roles: {type: Object, required: true}
}, { collection: 'permisos' });

module.exports = mongoose.model('Permisos', permisosSchema);