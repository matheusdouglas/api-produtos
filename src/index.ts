import express from 'express';
import productRoutes from './routes/productRoutes';
import { client } from './database/db';
import authRouter from './routes/authRoutes';

const app = express();
const port = 4200;

app.use(express.json());
app.use('/api', productRoutes);
app.use('/api', authRouter);


// Conectar ao banco antes de iniciar o servidor
client.connect()
    .then(() => {
        console.log('Banco de dados conectado com sucesso.');
        app.listen(port, () => {
            console.log(`Server is running ${port}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao conectar no banco:', err.message);
        process.exit(1);
    });
