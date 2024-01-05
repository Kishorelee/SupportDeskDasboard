const express = require("express");
const app =express();
const cors = require('cors');
require("dotenv").config();
const Database = require("./config/db");
const route =require("./routes/routes");
Database();
app.use(cors());
app.use(express.json());

app.use("/",route);


app.listen(process.env.PORT,()=>{
    console.log("server is running",process.env.PORT);
})