const mongoose = require("mongoose");

const connectDB = async () => {
    mongoose.set('strictQuery', false);
  const connection = await mongoose
    .connect(process.env.MONGO_URL)
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
};

module.exports = {connectDB};
