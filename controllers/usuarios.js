import { response, request } from "express";
import { modelo } from '../models/usuario.js';
import bcryptjs from 'bcryptjs';

///Aca la ponemos en mayusculas para poder crear instancias de este modelo
const Usuario = modelo;

export const usuariosGet = async(req = request, res = response) => {
    //const { q, nombre = 'No name', apikey, page = 1, limit = 10 } = req.query;
    //Desestructuramos los argumentos que vienen en la query y se los podemos mandar al .find()
    const { limite = 5, desde = 0} = req.query;//Por defecto ponemos 5
    const estadoQuery = {estado: true};

    /**
     * EN VEZ DE CREAR DOS CONSTANTES CON EL AWAIT, LO QUE NOS PUEDE RETRASAR LA RESPUESTA AL USUARIO, CREAMOS UNA COMIBNACION DE LAS MISMAS USANDO EN Promise.all
     * const usuarios = await Usuario.find(estadoQuery) //Para obtener los usuarios. al find() le podemos pasar instrucciones para obtener el limite o el desde por ejemplo
        .skip(Number(desde))
        .limit(Number(limite));
        const total = await Usuario.countDocuments(estadoQuery);
     */

    //Hacemos unas desestructuración de Arrgelos para poder mandarle la informacion mas amigablemente
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(estadoQuery),
        Usuario.find(estadoQuery) //Para obtener los usuarios. al find() le podemos pasar instrucciones para obtener el limite o el desde por ejemplo
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    

    //Esta es la respuesta que mandamos luego de hacer, en este caso, el GET
    res.json({
        total,
        usuarios
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

    //Esta es la respuesta que mandamos luego de hacer, en este caso, el PUT
    res.json(usuario);
}

export const usuariosDelete = async(req = request, res = response) => {

    const { id } = req.params;

    const uid = req.uid;

    //PARA BORRAR FISICAMENTE
    //const usuario = await Usuario.findByIdAndDelete(id);

    //Lo debemos borrar logicamente para no perder las referencias por si el usuario interactuo con el sistema
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json({
        usuario
    });
}