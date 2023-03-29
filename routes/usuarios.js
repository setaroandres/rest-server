
import { Router } from "express";
import { check } from "express-validator";
import { usuariosDelete, usuariosGet, usuariosPost, usuariosPut } from "../controllers/usuarios.js";
import { emailExiste, esRoleValido, existeUsuarioPorId } from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";

export const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId), //Usamos esta fcn para validar los custom validators
    check('role').custom(esRoleValido), //Usamos esta fcn para validar los custom validators
    //Una vez que chequeamos todos los campos con los checks (mandatory fields) le mandamos el middleware para no continuar a la ruta
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), //Usamos esta fcn para validar con express-validator
    check('correo', 'El correo ingresado no es válido').isEmail(), //Usamos esta fcn para validar con express-validator
    check('correo').custom(emailExiste), //Usamos esta fcn para validar los custom validators
    check('password', 'El password es obligatorio y minimo 6 letras').isLength({min: 6}), //Usamos esta fcn para validar con express-validator
    //check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']), //Usamos esta fcn para validar con express-validator
    check('role').custom(esRoleValido),//Usamos esta fcn para validar los custom validators
    //Una vez que chequeamos todos los campos con los checks (mandatory fields) le mandamos el middleware para no continuar a la ruta
    validarCampos
], usuariosPost);//como segundo arg podemos mandar un middleware para que se ejecuten antes de hacer la peticion al servidor.

router.delete('/', usuariosDelete);