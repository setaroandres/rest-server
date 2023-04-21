import { Router } from "express";
import { check } from "express-validator";
import { validaJWT, validaCampos, esAdmin } from "../middlewares/index.js";
import { existeCategoriaPorId, existeProductoPorId } from "../helpers/db-validators.js";
import { actualizarProducto, borrarProducto, crearProducto, obtenerProducto, obtenerProductos } from "../controllers/productos.js";

export const routerProductos = Router();

//Empezar por las routes y desp x el controlador

/**
 * {{url}}/api/productos
 */

//Obtener todos los productos - publico
routerProductos.get('/', obtenerProductos);

//Obtener un producto por id - publico
routerProductos.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validaCampos
], obtenerProducto);

//Crear un producto - privado - cualquier usuario con token valido
routerProductos.post('/', [
    validaJWT,//Con este middleware nos aseguramos que el usuario este logueado para acceder a esta ruta
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validaCampos //Para lanzar el error si no se cumplen las condiciones de validacion
], crearProducto); //El callback aca es la funcion del controller de productos para crear el producto

//Actualizar un producto por id - privado - cualquier usuario con token valido
routerProductos.put('/:id', [
    validaJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validaCampos
], actualizarProducto);

//Borrar una categoria por id - privado - Admin
routerProductos.delete('/:id', [
    validaJWT,
    esAdmin,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validaCampos
], borrarProducto);