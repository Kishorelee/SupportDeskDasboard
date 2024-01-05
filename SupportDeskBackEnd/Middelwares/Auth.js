const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const EmployeeData = require("../models/SignUpAndLoginUserDetails");
const mongoose = require("mongoose");
const protect = asyncHandler(async (req, res, next) => {
    try {
      let token;
  
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.Login_key);
  
        // Ensure that the decoded ID is in the correct format (ObjectId)
        const userId = new mongoose.Types.ObjectId(decoded.id);
  
        req.user = await EmployeeData.findById(userId).select("-password")
        next();
      } else {
        throw new Error('Invalid token format');
      }
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: 'Invalid token' });
    }
  });
module.exports = { protect };
