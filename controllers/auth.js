import { response } from "express";
import { modelo } from "../models/usuario.js";
import bcryptjs from 'bcryptjs';
import { generarJWT } from "../helpers/generar-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

const Usuario = modelo;

export const login = async(req, res = response) => {

    //Aca recibimos, una vez que pasan las validaciones, el body con la data del user
    const { correo, password } = req.body; //Del req tomo lo que manda el usuario en la request

    try {
        const usuario = await Usuario.findOne({ correo });
        
        //Verificar si correo existe
        if (!usuario) {
            return res.status(400).json({ //Con el res, le doy la respuesta al usuario
                msg: 'Usuario / Password no son correctos - Correo'
            });
        }

        //Verificar si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Pasword no son correctos - Usuario no está activo'
            });
        }

        //Verificar password
        const validPassword = bcryptjs.compareSync(password, usuario.password) //Con esta funcion le podemos preguntar si la contraseña enviada por el user hace match contra la base de datos

        if (!validPassword) {
            return res.status(400).json({ //Con el res, le doy la respuesta al usuario
                msg: 'Usuario / Password no son correctos - Password'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);

        //Mensaje para el usuario - Frontend
        res.json ({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salio mal, pongase en contacto con el administrador'
        })
    }
}

export const googleSignIn = async( req, res = response) => {

    const { id_token } = req.body;

    try {
        
        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        //Esta es toda la data que le mandamos a la base para crear el usuario
        if (!usuario) {
            //Si se autentica con Google y el usuario no existe hay que crearlo en nuestra DB
            const data = {
                nombre, 
                correo,
                password: ':P', //Se lo mandamos asi ya que va a usar el pass de google y nuneca nos lo va a pedir, debemos mandarlo pq es obligatorio.
                role: "USER_ROLE",
                img,
                google: true
            }

            //Nueva instancia de usuario con la data de login de google
            usuario = new Usuario(data);

            //Lo grabamos en la base
            await usuario.save();
        }

        //Si el usuario tiene estado en false, le bloqueamos el login
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario bloqueado - Pongase en contacto con el administrador'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se puede verificar'
        })
    }

 
}