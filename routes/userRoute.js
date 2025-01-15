import {Router} from 'express';
import { createUser, forgotPassword, loginUser, logoutUser, resetPassword } from '../controllers/userController.js';
import verifyRecaptcha from '../middleware/verifyRecaptcha.js';

const router = Router();

router.post('/create-user', verifyRecaptcha, createUser);
router.post('/login-user', verifyRecaptcha, loginUser);
router.post('/logout-user', logoutUser);
router.post('/send-link', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;