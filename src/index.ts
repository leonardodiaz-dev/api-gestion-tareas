import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import { routerBoard } from './routes/boardRoute';
import { routerTask } from './routes/taskRoute';
import { routerColumn } from './routes/columnRoute';
import { routerSubtask } from './routes/subtaskRoute';
import cors from 'cors'

const app = express();

app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));

app.use(express.json());
app.use(routerBoard);
app.use(routerTask)
app.use(routerColumn)
app.use(routerSubtask)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
