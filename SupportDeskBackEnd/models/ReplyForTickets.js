const mongoose = require('mongoose');

const replyForTicketSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmployeeData', // Reference to the TicketCreation model
    required: true,
  },

  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TicketCreation', // Reference to the TicketCreation model
    required: false,
  },
  employeeId :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TicketCreation', // Reference to the TicketCreation model
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReplyForTicket = mongoose.model('ReplyForTicket', replyForTicketSchema);

module.exports = ReplyForTicket;
