const mongoose = require('mongoose');

const ticketCreationSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['ticket', 'In Progress', 'Closed',],
    default: 'tickets',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmployeeData", // Reference to the EmployeeData model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TicketCreation = mongoose.model('TicketCreation', ticketCreationSchema);

module.exports = TicketCreation;
