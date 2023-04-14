import { Router } from "express";
import { check } from "express-validator";
import { googleSignIn, login } from "../controllers/auth.js";
import { validarCampos } from "../middlewares/validar-campos.js";

export const routerAuth = Router();

routerAuth.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);///Este callback se llama en los controladores (auth en este caso)

routerAuth.post('/google', [
    check('id_token', 'El Token de Google es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);