
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { Server } from './models/server.js';

dotenv.config();

const server = new Server();

server.listen();

/*const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);*/



