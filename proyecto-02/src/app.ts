import dotenv from 'dotenv';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/database';
import userRoutes from './routes/user.route';
import bookRoutes from './routes/book.route';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ mensaje: 'API de Biblioteca - Backend funcionando correctamente' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;