import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);

// request body: dados para criação ou atualização de um registro 
// route params: identificar qual recurso eu quero atualizar o deletar (pelo id ou etc)
// query params: usados para organização ou paginação



app.listen(3333);

