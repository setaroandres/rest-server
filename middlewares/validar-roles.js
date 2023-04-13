import { response } from "express";


export const esAdminRole = ( req, res = response, next ) => {

    ///Aca podemos captar el request con los datos del usuario ya que lo estamos validando en otro middleware
    ///Por eso no tenemos que hacer peticiones nuevamente a la base de datos acña
    if(!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { role, nombre } = req.usuario;

    if (role != 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede realizar la siguiente operacion`
        });
    }


    next(); //el next nos permite pasar al siguiente middleware/validacion si este es correcto
}

export const tieneRole = ( ...roles ) => {

    //Retornamos una funcion donde tenemos el req, el res y el next de esta manera ya que tieneRole debe recibir los roles validos.
    //Esta funcion se va a ejecutar en las routes
    return (req, res = response, next) => {
        
        if(!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            });
        }

        next();
    }
} 