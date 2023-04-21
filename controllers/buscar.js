import { request, response } from "express";
import mongoose from "mongoose";
import { Modelo, Categoria, Producto } from "../models/index.js";

const Usuario = Modelo;
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

//Aca recibimos la response sola pq venimos del metodo buscar y la req ya la recibimos ahi
const buscarUsuarios = async(termino = '', res = response) => {

    //Tenemos que validar si el termino es un mongoId valido ya que el frontend nos puede mandar el nombre del usuario o el id
    const esMongoId = mongoose.Types.ObjectId.isValid(termino); //Si es un mongoId valido va a retornar TRUE, sino FALSE

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.status(200).json({
            results: (usuario) ? [usuario] : [] //Si el usuario existe mandamos el arreglo con el usuario encontrado, sino mandamos un arreglo vacio, para evitar el null
        });
    }

    //Tenemos que hacer una Reg Exp pasra poder buscar que no sea case sensitive y buscar todos los resultados que contengan ese termino
    const regexp = new RegExp(termino, 'i');

    //Aca la mandamos el $or / $and (propio de mongo) para buscar por nombre o mail o lo que queramos
    const usuarios = await Usuario.find({ 
        $or: [{nombre: regexp}, {correo: regexp}],
        $and: [{estado: true}]
     });

    return res.status(200).json({
        results: usuarios //No hacemos el ternario aca ya que el find() retina un arreglo vacio si no hay resultados
    })

}

const buscarCategorias = async(termino = '', res = response) => {
    
    //Tenemos que validar si el termino es un mongoId valido ya que el frontend nos puede mandar el nombre del usuario o el id
    const esMongoId = mongoose.Types.ObjectId.isValid(termino); //Si es un mongoId valido va a retornar TRUE, sino FALSE

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.status(200).json({
            results: (categoria) ? [categoria] : [] //Si el usuario existe mandamos el arreglo con el usuario encontrado, sino mandamos un arreglo vacio, para evitar el null
        });
    }

    const regexp = new RegExp(termino, 'i');
    const categorias = await Categoria.find({nombre: regexp, estado: true});

    return res.status(200).json({
        results: categorias
    });

}

const buscarProductos = async(termino = '', res = response) => {
    
    //Tenemos que validar si el termino es un mongoId valido ya que el frontend nos puede mandar el nombre del usuario o el id
    const esMongoId = mongoose.Types.ObjectId.isValid(termino); //Si es un mongoId valido va a retornar TRUE, sino FALSE

    if (esMongoId) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre');
        return res.status(200).json({
            results: (producto) ? [producto] : [] //Si el usuario existe mandamos el arreglo con el usuario encontrado, sino mandamos un arreglo vacio, para evitar el null
        });
    }

    const regexp = new RegExp(termino, 'i');
    const productos = await Producto.find({nombre: regexp, estado: true})
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre');

    return res.status(200).json({
        results: productos
    });

}

export const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;  

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    };

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res)
        break;
    
        default:
            res.status(500).json({
                msg: 'Esta opcion de busqueda no se encuentra implementada en este momento'
            });
    }
}