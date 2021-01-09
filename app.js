const fs = require("fs");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
const protectRoute = require("./middleware/protectRoute");
dotenv.config({ path: "config.env" });
const cors = require("cors");
const PORT = process.env.BACK_PORT || 3001;

const app = express();

//body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//static file
app.use(express.static(path.join(__dirname, "public")));

//Main route root route
app.use("/users", userRouter);

//protectRoute
app.get("/dashboard", protectRoute, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

//Starting server
app.listen(PORT, () => {
  console.log(`Server up and running...${PORT} on http://localhost:${PORT}`);
});
