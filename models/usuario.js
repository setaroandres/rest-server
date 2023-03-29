import { Schema, model } from "mongoose";

//Acá debemos crear los modelos que queremos para nuestra base de datos de usuarios
const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: [true, 'El Role es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

///Podemos sobreescribir metodos para el Schema
usuarioSchema.methods.toJSON = function() {
    //desectructuramos los que no queremos tener y desp usamos el spread para tener todos los demas
    const { __v, password, ...usuario } = this.toObject();
    return usuario;
}

export const modelo = model('Usuario', usuarioSchema);