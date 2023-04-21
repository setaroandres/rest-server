///hacer como categorias, mismos methods Obtener, Update, Delete, Insert

import { request, response } from "express";
import { Producto } from "../models/index.js";

//obtenerProductos
export const obtenerProductos = async(req = request, res = response) => {
    
    const { limite = 5, desde = 0} = req.query;//Por defecto ponemos 5
    const estadoQuery = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(estadoQuery),
        Producto.find(estadoQuery)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })
}

//obtenerProducto - pupolate con el objeto de la categoria
export const obtenerProducto = async(req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        producto
    });

}

//crearProducto
export const crearProducto = async(req, res = response) => {

    //Aca podemos tomar los datos que nos mandan el usuario desde frontend (dentro del body) y manejarlo como nosotros deseamos
    /*const nombre = req.body.nombre.toUpperCase();
    const {descripcion, precio, categoria} = req.body;*/

    const {estado, usuario, ...body} = req.body;

    //Revisamos si existe una categoria previamente grabada con ese nombre
    //Primero tenemos que tener las categorias de la base
    const productoDB = await Producto.findOne({nombre: body.nombre});

    if (productoDB) {
        res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        });
    }

    //Generar la data que queremos guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id //Id del usuario que lo graba
    }

    
    //Instanciamos una nueva categoria
    const producto = new Producto(data);

    //La guardamos en la BD
    await producto.save();

    //Devolvemos el status con la creacion de la categoria en la respuesta
    res.status(201).json(producto);

}

//actualizarProducto
export const actualizarProducto = async(req = request, res = response) => {

    const { id } = req.params;
    //otra vez eliminamos los que no queremos y usamos el spread para dejar el resto
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id; //Aca le guardamos el usuario que esta actualizando

    //Aca guardamos la categoria y aparte la actualizamos. Lo devolvemos en el res.json
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});//El new lo usamos para ver el registro actualizado en la respuesta

    //Esta es la respuesta que mandamos luego de hacer, en este caso, el PUT
    res.json(producto);
}

//borrarProducto
export const borrarProducto = async(req = request, res = response) => {

    const { id } = req.params;

    //Lo debemos borrar logicamente para no perder las referencias por si el usuario interactuo con el sistema
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        producto
    });
}