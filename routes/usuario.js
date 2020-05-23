var express = require('express')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')

var mdAutenticacion = require('../middlewares/auth')

// var SEED = require('../config/config').SEED;

var app = express()

var Usuario = require('../models/usuario')

// ===========================
// Obtener todos los Usuarios
// ===========================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (e, usuarios) => {
                if (e) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: e
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Listado de usuarios realizado correctamente',
                    usuarios: usuarios
                })
            })
})

// ===========================
// Crear Usuario
// ===========================

app.post('/', mdAutenticacion.verificaToken ,(req, res) => {

    var body = req.body
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })

    usuario.save((e, usuarioGuardado) => {
        if (e) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: e
            })

        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuarioToken
        })
    })

})




// ===========================
// Actualizar Usuario
// ===========================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id
    var body = req.body;

    Usuario.findById(id, (e, usuario) => {

        if (e) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: e
            })
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario con el ID ' + id + ' no existe. ',
                errors: { message: 'No existe un usuario con ese ID' }
            })
        }

        usuario.nombre = body.nombre
        usuario.email = body.email
        usuario.role = body.role

        usuario.save((e, usuarioActualizado) => {
            if (e) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    errors: e
                })
            }

            usuarioActualizado.password = ':D'

            res.status(200).json({
                ok: true,
                usuario: usuarioActualizado
            })

        })
    })

})

// ===========================
// Eliminar Usuario por el ID
// ===========================
app.delete('/:id',mdAutenticacion.verificaToken , (req, res) => {

    var id = req.params.id

    Usuario.findByIdAndRemove(id, (e, usuarioBorrado) => {
        if (e) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
                errors: e
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                message: 'No existe el usuario con ese ID',
                errors: e
            })
        }

        usuarioBorrado.password = ":D"

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

})



module.exports = app;