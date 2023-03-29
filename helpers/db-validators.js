
import mongoose from "mongoose";
import { modeloRoles } from "../models/role.js";
import { modelo } from '../models/usuario.js';

///Aca la ponemos en mayusculas para poder crear instancias de este modelo
const Usuario = modelo;
const Role = modeloRoles;

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

export const existeUsuarioPorId = async(id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        const existeId = await Usuario.findById(id);
        if (!existeId) {
            throw new Error(`El id  ${id}  no existe en la BD`);
        }
    } else {
        throw new Error(`El id ${id} no es válido`);
    }
}