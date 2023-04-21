import { Schema, model } from "mongoose";

//El modelo lo utilizamos para establecer o generar las interacciones con la base de datos (Estos campos son los que vamos a insertar en la BD)
const productoSchema = Schema({
    //Aca establecemos todos los campos y validaciones/valores por defecto que vamos a necesitar para la base de datos
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true //Ponemos siempre el required para que no rompa la app
    },
    //Usuario que creó el producto
    usuario: {
        type: Schema.Types.ObjectId, //Al ser una relacion con otra tabla, el type tiene que ser un objeto de mongo
        ref: 'Usuario', //Esta es la referencia al Schema que va a apuntar
        required: true
    },
    precio: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId, //Al ser una relacion con otra tabla, el type tiene que ser un objeto de mongo
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

///Podemos sobreescribir metodos para el Schema
productoSchema.methods.toJSON = function() {
    //desectructuramos los que no queremos tener y desp usamos el spread para tener todos los demas
    const { __v, estado, ...data } = this.toObject();
    return data;
}

export const modeloProducto = model('Producto', productoSchema);