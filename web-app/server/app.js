const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const express = require("express");
const connection = require("./config/db");
const cors = require("cors");

const port = process.env.PORT;
const app = express();

//Import Routes
const dbRoutes = require("./routes/general");
const reportRoutes = require("./routes/reports");
const householdRoutes = require("./routes/household");

//Middlewares
app.use(cors());
app.use(express.json());

// Import routes
app.use("/api/db", dbRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/household", householdRoutes);

connection.connect((error) => {
  if (error) {
    console.log("----------------------------------");
    console.error("Error connecting to database:", error);
    console.log("----------------------------------");
  } else {
    app.listen(port, () => {
      console.log("----------------------------------");
      console.log("Connected to database!!");
      console.log("----------------------------------");
    });
  }
});
