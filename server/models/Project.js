const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  clientName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'on-hold'],  // Define the allowed values for status
    default: 'active' 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User', 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);