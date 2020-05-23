var jwt = require('jsonwebtoken')

var SEED = require('../config/config').SEED;


// ============================
// Verificar token - Middleware
// ============================
exports.verificaToken = function (req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (e, decoded) => {
        if (e) {
            res.status(401).json({
                ok: false,
                message: 'Token incorrecto',
                errors: e
            })
        }

        req.usuarioToken = decoded.usuario

        next()

        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // })
    })
}



