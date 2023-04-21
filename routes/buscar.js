import { Router } from "express";
import { check } from "express-validator";
import { buscar } from "../controllers/buscar.js";

export const routerBuscar = Router();

routerBuscar.get('/:coleccion/:termino', buscar);