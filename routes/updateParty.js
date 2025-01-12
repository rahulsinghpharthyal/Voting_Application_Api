import { Router } from 'express';
import Candidate from '../modles/candidateSchema'; // Corrected 'modles' to 'models'

const router = Router();

router.put('/', async (req, res) => { 
    try {
        const filter = { party: 'Bharatiya Janata Party (BJP)' }; // Example filter based on party from request body
        const update = { $set: { electionSymbol: 'https://res.cloudinary.com/dg56sdt6k/image/upload/v1736248480/llamoqcyrqalazk5b1t9.png' } }; // Update electionSymbol from request body

        const result = await Candidate.updateMany(filter, update);
        res.status(200).json({
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            message: "Documents updated successfully."
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating documents.", error });
    }
});

export default router;
