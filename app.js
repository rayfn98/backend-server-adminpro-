// Requires
var express = require('express');
var mongoose = require('mongoose')

// Inicializar Variables
var app = express();

// Conexión a la BDD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, resp) => {
    if (error) throw error;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online ')
})

// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })

})

// Escuchar peticiones
app.listen(3001, () => {
    console.log('Express server corriendo en el puerto 3001: \x1b[32m%s\x1b[0m', 'online ')
})