const mongoose = require("mongoose");
const bcrypt =require("bcrypt");
const EmployeesSchema = mongoose.Schema({
    // Personal Details
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNo: {
        type: String,
        required: true,
    },
    // Employees Details
    employeesId: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: false,
    },
    position: {
        type: String,  // Corrected field name
        required: false,
    },
    // Authentication
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // Time stamps
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
EmployeesSchema.pre("save", async function (next) {
    const user = this;

    // Hash the password only if it has been modified or is new
    if (!user.isModified("password")) return next();

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password along with the new salt
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Override the plaintext password with the hashed one
        user.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});
const EmployeeData = mongoose.model("EmployeeData", EmployeesSchema);
module.exports = EmployeeData;
