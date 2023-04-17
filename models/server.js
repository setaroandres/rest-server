import express from 'express';
import cors from 'cors';
import { router } from '../routes/usuarios.js';
import { routerAuth } from '../routes/auth.js';
import { dbConnection } from '../database/config.js';
import { routerCategorias } from '../routes/categorias.js';

const routes = router;
const auths = routerAuth;
const cats = routerCategorias;

export class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Creamos un obj con las rutas
        this.paths = {
            auth: '/api/auth',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios'
        }

        //Conectamos con la base de datos
        this.conectarDB();

        //Middlewares - Funciones que se ejecutan cuando levantamos nuestro servidor. Antes de realizar las peticiones a la base de datos o llamar a un controlador
        this.middlewares();

        //Rutas de la app
        this.routes();
    }

    //CONECTAR A BASE DE DATOS
    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        //Con esto, cualquier informacion que venga en el body para POST, PUT, DELETE va a ser leida y serializada a JSON
        this.app.use(express.json());

        //Directorio publico. Aca manejamos el index de la app, no es necesario una ruta que especifique el index dentro de routes()
        this.app.use(express.static('public'));
    }

    //Aca definimos todas las rutas para que puedan ser utilizadas
    //Aca definimos que en el path (/categorias, /usuarios, etc), vamos a utilizar las rutas definidas en el router
    routes() {
        this.app.use(this.paths.auth, auths);
        this.app.use(this.paths.usuarios, routes);//Aca hacemos el require del archivo de routes correspondiente
        this.app.use(this.paths.categorias, cats);
    }

    listen() {
        this.app.listen(this.port , () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        });
    }

}