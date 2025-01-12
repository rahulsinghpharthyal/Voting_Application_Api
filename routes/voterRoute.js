import Router from 'express';
import { getAllVoter, registerForVoting } from '../controllers/voterController.js';

const router = Router();

router.post('/register/:id', registerForVoting);
router.get('/allVoter', getAllVoter);

export default router;
