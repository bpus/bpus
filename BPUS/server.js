const express = require('express');
const compression = require('compression')
const app = express();
 
var app = express()
 
// compress all responses
app.use(compression())

app.use(express.static('./dist/bpus'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/bpus/'}),
);

app.listen(process.env.PORT || 8080);