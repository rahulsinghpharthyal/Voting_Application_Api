import {Router} from 'express';
import { createUser, loginUser, logoutUser } from '../controllers/userController.js';

const router = Router();

router.post('/create-user', createUser);
router.post('/login-user', loginUser);
router.post('/logout-user', logoutUser);

export default router;