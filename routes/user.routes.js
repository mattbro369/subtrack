import { Router } from 'express';
import { getUsers, getUserById } from '../controllers/user.controller.js';
import { authorize } from '../middleware/auth.middleware.js';

const userRouter = Router();

userRouter.get('/', authorize, getUsers);

userRouter.get('/:id', authorize, getUserById);

userRouter.post('/', (req, res) => res.send({ title: 'Add new user' }));

userRouter.put('/:id', (req, res) => res.send({ title: 'Update user' }));

userRouter.delete('/:id', (req, res) => res.send({ title: 'Delete user' }));

export default userRouter;
