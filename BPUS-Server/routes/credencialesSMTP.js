const express = require('express');
const app = express();
const mdAuth = require('../middlewares/autenticacion');
const credencialesSMTP = require('../models/credencialesSMTP');

app.get('/', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req,res) => {
    credencialesSMTP.find({}, (err, credencialesSMTP) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'Hubo un error!'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                credencialesSMTP: credencialesSMTP[0]
            });
        }
    })
});

app.put('/', [mdAuth.VerificarToken, mdAuth.VerifyAdmin], (req,res) => {
    credencialesSMTP.findByIdAndUpdate(req.body._id, req.body, (err, credencialesSMTP) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'Hubo un error!'
            });
        }else if(!credencialesSMTP){
            res.status(400).json({
                ok: false,
                mensaje: 'no se encontro ninguna credencial!'
            });   
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
            });
        }
    });
})

module.exports = app;