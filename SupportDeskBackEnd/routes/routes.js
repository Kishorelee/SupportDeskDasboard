// routes.js
const express = require("express");

const router = express.Router();
const EmployeeController = require("../controllers/EmployeeController");
const TicketController =require("../controllers/TicketController");
const ReplyTicketController =require("../controllers/ReplyTicketController")
//


//middlewares
const {protect} =require("../Middelwares/Auth");
//user details
router.post('/api/user/signup',  EmployeeController.createUser);
router.get('/api/employees', EmployeeController.userData);
router.post('/api/user/login', EmployeeController.userlogin);

//ticket creation
router.post("/api/ticketcreation",protect,TicketController.createTicket);
router.put("/api/updateTicket/:id",protect,TicketController.updateTicket);
router.delete("/api/deleteTicket/:id",protect,TicketController.deleteTicket);
router.get("/api/getTicketsByUserId/:id",protect,TicketController.getTicketsByUserId);
router.get("/api/getAllTickets",TicketController.getAllTickets);
router.get("/api/getTicket/:ticketId",TicketController.getTicket);
//ReplyForTicket
router.post("/api/reply/:ticketId",protect,ReplyTicketController.createReplyForTicket);
router.get("/api/getAllreply",ReplyTicketController.getAllreply);
router.get("/api/getreplyByemployeeId",protect,ReplyTicketController.getreplyByemployeeId);
module.exports = router;
