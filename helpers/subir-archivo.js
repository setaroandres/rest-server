//Aca creamos toda la logica de subir archivos para que pueda ser reutilizable y no tenerla en el controlador
import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpetaDestino = '') => {//Por defecto le mandamos esas extensiones, sino podemos modificarlas cuando usamos la fcn
    //Retornamos una promesa para esperar al resolucion, por bien o por mal
    return new Promise((resolve, reject) => {

        //Desestructuramos y almacenamos el archivo subido
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.'); //Creamos un array con el nombre y la extension del archivo
        const extension = nombreCortado[nombreCortado.length - 1] //Tomamos el valor de la ultima posicion

        //Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es valida. Las extensiones permitidas son: ${extensionesValidas}`);
        }

        //Creamos un id unico de nombre de archivo usando uuid
        const nombreTemp = uuidv4() + '.' + extension;

        //Armamos el pat dnd se va a guardar el archivo
        const uploadPath = path.join(__dirname, '../uploads/', carpetaDestino, nombreTemp);

        //Esta es la funcion para mover el archivo (mv)
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
        });

    })
}