const EmployeeData = require("../models/SignUpAndLoginUserDetails");
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken"); 
// Create a user 
const createUser = async (req, res) => {
  const userData = req.body;

  try {
    // Check if the username or email already exists
    const existingUser = await EmployeeData.findOne({
      $or: [{ userName: userData.userName }, { email: userData.email }],
    });

    if (existingUser) {
      // User with the provided username or email already exists
      return res.status(400).json({
        error: 'Username or email already exists',
      });
    }

    // If the user does not exist, create a new user
    const newUser = await EmployeeData.create(userData);
    res.status(201).json(newUser);
    console.log('User is created');
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({
      error: 'SignUp Failed',
    });
  }
};
const userData = async (req, res) => {
  try {
    const employees = await EmployeeData.find();
    res.json({ users: employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting employees' });
  }
}


const userlogin = async (req, res) => {
  const { userName, employeesId, password,} = req.body;
  console.log('Received login request:', { userName, employeesId});
  try {
    // Check if the user exists
    const user = await EmployeeData.findOne({ userName, employeesId,});
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('User details:', {
      _id: user._id,
      userName: user.userName,
      employeesId: user.employeesId,
    });
    // If credentials are valid, send user data to the frontend
    res.json({ message: 'Login successful', user: { userName: user.userName, employeeId: user.employeesId,userId:user._id ,token :generateToken(user._id) } });
    console.log({ message: 'Login successful', user: { userName: user.userName, employeeId: user.employeesId, token :generateToken(user._id) } })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const generateToken =(id)=>{
  var token = jwt.sign({id},'shhhh',{expiresIn:"30d"});
  return token;
} 

module.exports = {
  createUser,
  userData,
  userlogin
};