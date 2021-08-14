const dotenv = require('dotenv');
dotenv.config();

// Creamos una constante del token generado en el login.
// Exportamos el seed para el token
module.exports.SEED = process.env.SEED;