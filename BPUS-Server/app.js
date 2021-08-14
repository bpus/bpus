// Iniciamos el servidor express
var express = require('express');
var mongoose = require('mongoose');
const dotenv = require('dotenv');

// Importamos la librería de cors
var cors = require('cors');

var bodyParser = require('body-parser');
var app = express();

app.use(cors());
dotenv.config();

// Middleware de Cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://bpus-316916.web.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    next();
});


// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importación de rutas
const mainRoute = require('./routes/main');
const loginRoute = require('./routes/login');
const modalidadRoute = require('./routes/modalidad');
const programaRoute = require('./routes/programa');
const gestPasantiaRoute = require('./routes/pasantia');
const empresasRoute = require('./routes/empresa');
const vacantesRoute = require('./routes/vacantes');
const uploadPasantiaRoute = require('./routes/uploadFilePasantia');
const uploadProyectoRoute = require('./routes/uploadFileProyecto');
const uploadConvenioRoute = require('./routes/uploadFileConvenio');
const sendPasantiaRoute = require('./routes/sendFilePasantia');
const sendConvenioRoute = require('./routes/sendFileConvenio');
const sendProyectoRoute = require('./routes/sendFileProyecto');
const convenioRoute = require('./routes/convenio');
const notificacionesRoute = require('./routes/notificacion');
const estudianteRoute = require('./routes/estudiante');
const administrativosRoute = require('./routes/administrativo');
const rolRoute = require('./routes/roles');
const permisoRoute = require('./routes/permisos');
const proyectoRoute = require('./routes/proyecto');
const lineaRoute = require('./routes/lineaInvestigacion');
const busquedaRoute = require('./routes/busqueda');
const credencialesSMTPRoute = require('./routes/credencialesSMTP');

// Rutas
app.use('/credencialesSMTP', credencialesSMTPRoute);
app.use('/busqueda',busquedaRoute);
app.use('/lineaInvestigacion',lineaRoute);
app.use('/proyecto',proyectoRoute);
app.use('/permisos',permisoRoute);
app.use('/roles',rolRoute);
app.use('/administrativos', administrativosRoute);
app.use('/estudiantes', estudianteRoute);
app.use('/upload_convenio', uploadConvenioRoute);
app.use('/notificaciones', notificacionesRoute);
app.use('/convenios', convenioRoute);
app.use('/send_file_pasantia', sendPasantiaRoute);
app.use('/send_file_convenio', sendConvenioRoute);
app.use('/send_file_proyecto', sendProyectoRoute);
app.use('/upload_pasantia', uploadPasantiaRoute);
app.use('/upload_proyecto', uploadProyectoRoute);
app.use('/vacantes', vacantesRoute)
app.use('/empresas', empresasRoute);
app.use('/pasantia', gestPasantiaRoute);
app.use('/programa', programaRoute);
app.use('/modalidades', modalidadRoute);
app.use('/login', loginRoute);
app.use('/', mainRoute);

mongoose.connection.openUri(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true },
    (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
        }
    });

app.listen(process.env.PORT || 8080);