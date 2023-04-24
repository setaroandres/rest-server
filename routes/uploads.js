import { Router } from "express";
import { check } from "express-validator";
import { validaCampos, validarArchivo } from "../middlewares/index.js";
import { actualizarImg, cargarArchivos, mostrarImagen } from "../controllers/uploads.js";
import { coleccionesPermitidas } from "../helpers/db-validators.js";

export const routerUploads = Router();

//Ruta para subir imagenes
routerUploads.post('/', validarArchivo, cargarArchivos);///Este callback se llama en los controladores (auth en este caso)

//Ruta para actualizar imagenes
routerUploads.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validaCampos
], actualizarImg);

//Ruta para obtener las img y poder mostrarlas en el Frontend
routerUploads.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validaCampos
], mostrarImagen);

