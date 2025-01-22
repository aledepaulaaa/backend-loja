require("dotenv").config()
const mongoose = require("mongoose")

const uri = process.env.MONGO_URI

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      dbName: "japizza_database",
    })
    console.log("mongodb connection success!")
  } catch (err) {
    console.log("mongodb connection failed!", err.message)
  }
}

module.exports = { connectDB }
