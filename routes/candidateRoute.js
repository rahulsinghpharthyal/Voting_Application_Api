import { Router } from 'express';
import { createCandidate, deleteCandidate, getCandidateByUser, getCandidates, updateCandidate, updateParty } from '../controllers/candidateController.js';

const router = Router();
 
router.post('/create-candidate', createCandidate);
router.patch('/update-candidate/:id', updateCandidate);
router.get('/get-candidate', getCandidates);
router.delete('/delete-candidate/:id', deleteCandidate);
router.put('/partys', updateParty);
router.get('/getCandiateByUserState/:id', getCandidateByUser);

export default router;