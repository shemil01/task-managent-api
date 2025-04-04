const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/authRoute");
const taskRoute = require("./routes/taskRoute");
const adminRoute = require("./routes/adminRoute");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoute);
app.use("/api", taskRoute);
app.use("/api", adminRoute);

connectDB();

const PORT = process.env.PORT;  
    
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
