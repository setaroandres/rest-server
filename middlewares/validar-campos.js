import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {
    //Acá vamos a poder verificar los errores que me va almacenando express-validators con las funciones check() que usamos en las routes
    //next es lo que tenemos que llamar si el middleware pasa y no encuentra ningun error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    //Si no encuentra ningun error, sigue con el siguiente middleware
    next();
}