import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';



const routes = express.Router();
const classescontroller = new ClassesController();
const connectionscontroller = new ConnectionsController();


routes.get('/classes', classescontroller.index);
routes.post('/classes', classescontroller.create);

routes.get('/connections', connectionscontroller.index);
routes.post('/connections', connectionscontroller.create);
export default routes;

