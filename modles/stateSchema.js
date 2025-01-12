import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema({
  states: {
    type: Array,
    required: true
  }
});

const State = mongoose.model('State', stateSchema);

export default State;