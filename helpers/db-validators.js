
import mongoose from "mongoose";
/*import { modeloRoles } from "../models/role.js";
import { modelo } from '../models/usuario.js';*/
import { Categoria, Modelo, Producto, Roles } from "../models/index.js";

///Aca la ponemos en mayusculas para poder crear instancias de este modelo
const Usuario = Modelo;
const Role = Roles;

export const esRoleValido = async(role = '') => {
    const existeRole = await Role.findOne({role});
    if (!existeRole) {
        throw new Error(`El Rol ${role} no está registrado en la base de datos`);
    }
}

export const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya se encuentra registrado.`);
    }
}

//Validador personalizado para saber si existe el usuario por id
export const existeUsuarioPorId = async(id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        const existeId = await Usuario.findById(id);
        if (!existeId) {
            throw new Error(`El id ${id} no existe en la BD`);
        }
    } else {
        throw new Error(`El id ${id} no es válido`);
    }
}

//Validador personalizado para saber si existe la categoria por id antes de mostrarlo o updtear
export const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id ${id} no existe en la BD`);
    }
}

//Validador personalizado para saber si existe el producto por id antes de mostrarlo o updatear
export const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id ${id} no existe en la BD`);
    }
}