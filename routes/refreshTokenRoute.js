import { Router } from 'express';
import getRefreshToken from '../controllers/refreshTokenController.js';

const router = Router();
 
router.get('/refresh-token', getRefreshToken);

export default router;