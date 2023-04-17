////En el controlador manejamos todas las interacciones con la base de datos (validaciones / guardado / mensajes de error) para que el registro se guarde como nosotros lo deseamos

import { request, response } from "express";
import { Categoria } from "../models/index.js";

//Contoladores que tenemos que crear
/** 
 * obtenerCategorias - paginado - total de registros - agregar populate (Hace la relacion del id con el usuario)
 * obtenerCategoria - pupolate con el objeto de la categoria
 * 
 */

//obtenerCategorias - paginado - total de registros - agregar populate (Hace la relacion del id con el usuario)
export const obtenerCategorias = async(req, res = response) => {

    const { limite = 5, desde = 0} = req.query;//Por defecto ponemos 5
    const estadoQuery = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(estadoQuery),//Este va a ser el total
        Categoria.find(estadoQuery)//Estas van a ser las categorias
            .populate('usuario', 'nombre')//Aca hacemos la relacion con el id del usuario y mostramos el nombre
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

export const crearCategoria = async(req, res = response) => {

    //Aca podemos tomar los datos que nos mandan el usuario desde frontend (dentro del body) y manejarlo como nosotros deseamos
    const nombre = req.body.nombre.toUpperCase();

    //Revisamos si existe una categoria previamente grabada con ese nombre
    //Primero tenemos que tener las categorias de la base
    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    //Generar la data que queremos guardar
    const data = {
        nombre, //Nombre de la categoria
        usuario: req.usuario._id //Id del usuario que lo graba
    }

    //Instanciamos una nueva categoria
    const categoria = new Categoria(data);

    //La guardamos en la BD
    await categoria.save();

    //Devolvemos el status con la creacion de la categoria en la respuesta
    res.status(200).json(categoria);

}

//obtenerCategoria - pupolate con el objeto de la categoria
export const obtenerCategoria = async(req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre');

    res.json({
        categoria
    });

}

//actualizarCategoria
export const actualizarCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    //otra vez eliminamos los que no queremos y usamos el spread para dejar el resto
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id; //Aca le guardamos el usuario que esta actualizando

    //Aca guardamos la categoria y aparte la actualizamos. Lo devolvemos en el res.json
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});//El new lo usamos para ver el registro actualizado en la respuesta

    //Esta es la respuesta que mandamos luego de hacer, en este caso, el PUT
    res.json(categoria);
}

//borrarCategoria
export const borrarCategoria = async(req = request, res = response) => {

    const { id } = req.params;

    //Lo debemos borrar logicamente para no perder las referencias por si el usuario interactuo con el sistema
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        categoria
    });
}