import {response, request} from "express";

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

export const usuariosPost = (req = request, res = response) => {

    //Guardamos la data que nos envia el usuario, que viene en la request
    const { nombre, edad } = req.body;

    //Esta es la respuesta que le damos al usuario
    res.json({
        msg: 'post API - Controlador',
        nombre,
        edad
    });
}

export const usuariosPut = (req = request, res = response) => {

    const { id } = req.params;

    res.json({
        msg: 'put API - Controlador',
        id
    });
}

export const usuariosDelete = (req = request, res = response) => {
    res.json({
        msg: 'delete API - Controlador'
    });
}