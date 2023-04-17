import { Router } from "express";
import { check } from "express-validator";
import { validaJWT, validaCampos, esAdmin } from "../middlewares/index.js";
import { actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategoria, obtenerCategorias } from "../controllers/categorias.js";
import { existeCategoriaPorId } from "../helpers/db-validators.js";

export const routerCategorias = Router();


/**
 * {{url}}/api/categorias
 */

//Obtener todas las categorias - publico
routerCategorias.get('/', obtenerCategorias);

//Obtener una categoria por id - publico
routerCategorias.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validaCampos
], obtenerCategoria);

//Crear una categoria - privado - cualquier usuario con token valido
routerCategorias.post('/', [
    validaJWT,//Con este middleware nos aseguramos que el usuario este logueado para acceder a esta ruta
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validaCampos //Para lanzar el error si no se cumplen las condiciones de validacion
], crearCategoria); //El callback aca es la funcion del controller de categorías para crear la categoria

//Actualizar una categoria por id - privado - cualquier usuario con token valido
routerCategorias.put('/:id', [
    validaJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validaCampos
], actualizarCategoria);

//Borrar una categoria por id - privado - Admin
routerCategorias.delete('/:id', [
    validaJWT,
    esAdmin,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validaCampos
], borrarCategoria);
