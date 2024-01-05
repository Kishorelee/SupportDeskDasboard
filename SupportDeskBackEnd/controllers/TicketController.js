const TicketCreation = require("../models/TicketCreation");
const mongoose = require("mongoose");

const createTicket = async (req, res) => {
  console.log("Requested user", req.user);
  try {
    // Assuming you are receiving ticket information in the request body
    const {
      employeeName,
      email,
      phone,
      subject,
      description,
      status,
      attachments,
    } = req.body;

    // Creating a new ticket instance
    const newTicket = new TicketCreation({
      employeeName,
      email,
      phone,
      subject,
      description,
      status,
      attachments,
      userId: req.user._id, // Set the user ID for the ticket
    });

    // Saving the ticket to the database
    const savedTicket = await newTicket.save();

    res.status(201).json(savedTicket);
   
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Error creating ticket" });
  }
};
const updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { subject, description, status } = req.body;

    // Find the ticket by its _id and userId
    const query = { _id: ticketId, userId: req.user._id };
    const ticket = await TicketCreation.findOne(query);

    if (!ticket) {
      console.log("Ticket not found");
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Update only the provided fields
    if (subject) ticket.subject = subject;
    if (description) ticket.description = description;
    if (status) ticket.status = status;

    // Save the updated ticket
    const updatedTicket = await ticket.save();

    console.log("Ticket updated:", updatedTicket);
    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ error: "Error updating ticket" });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;

    // Find the ticket by its _id and userId
    const ticket = await TicketCreation.findOne({ _id: ticketId, userId: req.user._id });

    if (!ticket) {
      console.log("Ticket not found");
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Check if the ticket is closed
    if (ticket.status !== 'Closed') {
      console.log("Cannot delete an open or in-progress ticket");
      return res.status(400).json({ error: "Cannot delete an Unopen or in-progress ticket" });
    }

    // Delete the ticket
    await ticket.deleteOne();

    console.log("Ticket deleted successfully");
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: "Error deleting ticket" });
  }
};


const getTicketsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Requested userId:", userId);

    // Correct usage: invoke mongoose.Types.ObjectId with the new keyword
    const userIdObject = new mongoose.Types.ObjectId(userId);

    // Find tickets by userId and populate the referenced data from EmployeeData
    const tickets = await TicketCreation.find({ userId: userIdObject }).populate("userId");

    if (!tickets || tickets.length === 0) {
      console.log("No tickets found for the userId");
      return res.status(404).json({ error: "No tickets found for the userId" });
    }

   
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error getting tickets:", error);
    res.status(500).json({ error: "Error getting tickets" });
  }
};

const getAllTickets = async(req,res)=>{
  try {
    // Find all tickets and populate the referenced data from EmployeeData
    const tickets = await TicketCreation.find().populate("userId");

    if (!tickets || tickets.length === 0) {
      console.log("No tickets found");
      return res.status(404).json({ error: "No tickets found" });
    }

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error getting tickets:", error);
    res.status(500).json({ error: "Error getting tickets" });
  }
};
const getTicket = async (req, res) => {
  const ticketId = req.params.ticketId;

  if (!mongoose.Types.ObjectId.isValid(ticketId)) {
    return res.status(404).send("Invalid Id");
  }

  try {
    const ticket = await TicketCreation.findById(ticketId);

    if (!ticket) {
      return res.status(404).send("The ticket with the given ID was not found");
    }

    res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket by ID:", error);
    res.status(500).json({ error: "Error fetching ticket by ID" });
  }
};
module.exports = {
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketsByUserId,
  getAllTickets,
  getTicket,
};
