import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
    voterId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voter',
        required: true,
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    }
}, {timeStamps: true});

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;