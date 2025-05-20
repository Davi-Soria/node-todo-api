import { Router } from 'express';
import * as todoController from '../controllers/todo.controller';

const router = Router();

router.get('/todo', todoController.all);
router.post('/todo', todoController.add);
router.put('/todo/:id', todoController.update);
router.delete('/todo/:id', todoController.remove)

export default router;