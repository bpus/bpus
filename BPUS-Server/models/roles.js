var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rolesSchema = new Schema({
    nombre:{type: String, required: true, unique:true},
    estado: { type: Boolean, required: true, default: true}
}, { collection: 'roles' });

module.exports = mongoose.model('Roles', rolesSchema);