import Router from 'express';
import { getState } from '../controllers/stateController.js';

const router = Router();

router.get('/states', getState)


export default router;