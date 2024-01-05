const ReplyForTicket =require("../models/ReplyForTickets")
const TicketCreation = require("../models/TicketCreation");
const mongoose = require("mongoose");
const createReplyForTicket = async (req, res) => {
  console.log("Requested user", req.user);
  const ticketId = req.params.ticketId;
  try {
      const { message, status } = req.body;

      // Assuming you have userId available in req.user
      const userId = req.user._id;

      // Find ticket in TicketCreation collection by ticketId
      const ticketCreation = await TicketCreation.findById(ticketId);

      if (!ticketCreation) {
          throw new Error('Ticket not found in TicketCreation');
      }

      // Use userId from the found ticket as employeeId
      const employeeIdFromTicket = ticketCreation.userId;

      // Create a new reply for the ticket
      const newReply = new ReplyForTicket({
          message,
          status,
          userId: userId,
          employeeId: employeeIdFromTicket,
          ticketId: ticketId,
      });

      // Save the new reply
      const savedReply = await newReply.save();

      // Update ticket status in TicketCreation
      await TicketCreation.findByIdAndUpdate(ticketId, { status });

      res.status(201).json(savedReply);
  } catch (error) {
      console.error('Error creating reply for ticket:', error);
      res.status(500).json({ error: 'Error creating reply for ticket' });
  }
};



  const getAllreply = async (req, res) => {
    try {
        // Find all replies associated with the given ticketId
        const replies = await ReplyForTicket.find();

        if (!replies || replies.length === 0) {
            return res.status(404).json({ message: 'No replies found for the specified ticket' });
        }

        res.status(200).json(replies);
    } catch (error) {
        console.error('Error fetching replies for ticket:', error);
        res.status(500).json({ error: 'Error fetching replies for ticket' });
    }
};
const getreplyByemployeeId = async (req, res) => {
  const employeeId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(404).send("Invalid Id");
  }

  try {
    // Find all replies associated with the given employeeId
    const replies = await ReplyForTicket.find({ employeeId: employeeId });

    if (!replies || replies.length === 0) {
      return res.status(404).json({ message: 'No replies found for the specified employeeId' });
    }

    // Populate the replierUserId and replierName
    const populatedReplies = await ReplyForTicket.find({ employeeId: employeeId })
      .populate("userId", "userName")  // Assuming "username" is the field in the User model that you want to retrieve
      .exec();

    res.status(200).json(populatedReplies);

  } catch (error) {
    console.error('Error fetching replies for employee:', error);
    res.status(500).json({ error: 'Error fetching replies for employee' });
  }
};

module.exports = { 
  createReplyForTicket,
  getAllreply,
  getreplyByemployeeId,
 };