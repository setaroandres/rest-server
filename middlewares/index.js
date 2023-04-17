///Si ponemos un index.js dentro de la carpeta de middlewares va a apuntar directamente a este archivo por defecto (como un index.html)

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole, tieneRole } from "../middlewares/validar-roles.js";

export const validaCampos = validarCampos;
export const validaJWT = validarJWT;
export const validaTieneRole = tieneRole;
export const esAdmin = esAdminRole;