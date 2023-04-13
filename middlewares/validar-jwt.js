import { request, response } from 'express';
import jwt  from 'jsonwebtoken';
import { modelo } from '../models/usuario.js';

const Usuario = modelo;

export const validarJWT = async(req = request, res = response, next) => {

    //El token lo vamos a enviar en los headers (x-token). Debemos leer los headers
    const token = req.header('x-token'); //Aca leemos el header que queremos capturar

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en al peticion - Unauthorized'
        });
    }

    try {
        
        //Esta fcn nos sirve para verificar el JWT, si no es valido va a saltar al catch error
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario no existe en DB'
            });
        }

        //Verificamos si el usuario no ha sido borrado
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado: false'
            });
        }

        req.usuario = usuario;

        next();//El next nos permite continuar con los diferentes middlewares de validacion que tenga esa route, si falla no continua con los demas
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }

    console.log(token);

}