import {Router} from 'express';
import { createVote, totalVotes } from '../controllers/voteController.js';

const router = Router();

router.post('/create-vote/:userId', createVote);
router.get('/totalVotes', totalVotes);

export default router;