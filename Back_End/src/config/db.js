const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error); // <-- asli error yahan milega
    process.exit(1);
  }
};
