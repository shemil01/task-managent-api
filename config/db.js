const mongoos = require("mongoose");

const connectDB = async function () {
  try {
    await mongoos.connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Data base connected");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;
