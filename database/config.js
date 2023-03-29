import mongoose from 'mongoose';

export const dbConnection = async() => {

    try {
        await mongoose.connect( process.env.MONGODB_ATLAS);
        console.log('Base de datos online');
    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexion con la base de datos');
    }

}