import { response, request } from "express";
import { modelo } from '../models/usuario.js';
import bcryptjs from 'bcryptjs';

///Aca la ponemos en mayusculas para poder crear instancias de este modelo
const Usuario = modelo;

export const usuariosGet = (req = request, res = response) => {
    const { q, nombre = 'No name', apikey, page = 1, limit = 10 } = req.query;

    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

export const usuariosPost = async (req = request, res = response) => {
    
    //Guardamos la data que nos envia el usuario, que viene en la request
    //Usamos desestructuracion para tomar solo lo que necesitamos y creamos la nueva instancia de usuario
    const { nombre, correo, password, role } = req.body;
    const usuario = new Usuario({
        nombre,
        correo,
        password,
        role
    });

    //Encriptar la contraseña
    //genSaltSync es el nro de vueltas que queremos para hacer mas complicada la encriptacion - 10 por defecto
    const salt = bcryptjs.genSaltSync();
    //hashSync es para encriptarlo en una sola via
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en DB
    //Para grabar el registro en la base de datos
    await usuario.save();

    //Esta es la respuesta que le damos al usuario
    res.json({
        usuario
    });
}

export const usuariosPut = async(req = request, res = response) => {

    const { id } = req.params;
    //otra vez eliminamos los que no queremos y usamos el spread para dejar el resto
    const { _id, password, google, correo, ...resto } = req.body;

    //if password es que quiere modificar su contraseña
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    //Aca guardamos el usuario encontrado y aparte lo actualizamos. Lo devolvemos en el res.json
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'put API - Controlador',
        usuario
    });
}

export const usuariosDelete = (req = request, res = response) => {
    res.json({
        msg: 'delete API - Controlador'
    });
}