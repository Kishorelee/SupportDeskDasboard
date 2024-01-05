const mongoose = require("mongoose");

const connectDb =async()=>{
    try{
        const databaseURL = await mongoose.connect(process.env.MONGODBURL);
        console.log("Database connected")
    }catch(e){
        console.log(e);
        process.exit(1);
    }
}

module.exports =connectDb;