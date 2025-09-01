const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("DB connected");
  } catch (error) {
    console.log("fail to connnect to Database", error);
  }
}


module.exports = connectDB