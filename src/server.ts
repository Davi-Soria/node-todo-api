import express, { urlencoded } from 'express';
import 'dotenv/config';
import cors from 'cors';
import router from './routes/main';
import helmet from 'helmet';
import { sequelize } from './instances/pg';
import { Todo } from './models/todo';

const server = express();
server.use(helmet());
server.use(cors());
server.use(urlencoded({ extended: true }));
server.disable('x-powered-by');
server.use(express.json());

server.use(router);

const port = process.env.PORT || 3000;

sequelize.authenticate()
.then(() => {
    console.log('Conectado ao banco com sucesso.');
})
.then(() => {
    console.log('Modelos sincronizados');
    server.listen(port, () => {
        console.log(`Servidor rodando em http:${port}`)
    });
})
.catch((error) => {
    console.error('Erro ao iniciar o servidor:', error)
})
