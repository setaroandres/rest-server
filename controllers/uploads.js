import { request, response } from "express";
import { subirArchivo } from "../helpers/subir-archivo.js";
import { Modelo, Producto } from "../models/index.js";

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Usuario = Modelo;

export const cargarArchivos = async(req = request, res = response) => {

    //Usamos un try catch para poder hacer la resolucion de la promesa y que no reviente la app. Le mandamos el mensaje que devuelve la promesa
    try {
        //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({
            nombre
        });

    } catch (msg) {
        res.status(400).json({
            msg
        })
    }

}

export const actualizarImg = async(req = request, res = response) => {

    const { coleccion, id } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `El usuario ${id} no existe en la BD`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `El producto ${id} no existe en la BD`
                });
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Esta coleccion no está validada'
            });
    }

    //Hacemos el borrado de la img previa si es que existe
    if(modelo.img) {
        //Hay que borrar la img del servidor. Le pasamos la base url, la carpeta, la coleccion de la cual queremos borrar y el nombre de la img a borrar
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        //Preguntamos si existe fisicamente en el file system, si existe la borramos
        if(fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    //Tomamos el nombre y actualizamos la prop img del modelo solicitado
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    //Lo salvamos en la base de datos
    await modelo.save();

    res.json({
        modelo
    })
}

export const mostrarImagen = async(req = request, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `El usuario ${id} no existe en la BD`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `El producto ${id} no existe en la BD`
                });
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Esta coleccion no está validada'
            });
    }

    //Chequeamos si la img existe y hacemos el sendFile
    if(modelo.img) {
        //Hay que borrar la img del servidor. Le pasamos la base url, la carpeta, la coleccion de la cual queremos borrar y el nombre de la img a borrar
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        //Preguntamos si existe fisicamente en el file system, si existe la borramos
        if(fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    //Construir el path y mandar el placeholder
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathImagen);
}