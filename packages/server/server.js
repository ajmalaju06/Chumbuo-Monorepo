require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const categoriesRouter = require("./src/routes/Categories");
const userRouter = require("./src/routes/User");
const loginRouter = require("./src/routes/Auth");
const blogRouter = require("./src/routes/Blogs");

const app = express();
mongoose.connect(process.env.DATABASE_URL, { useNewUrlparser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database is connected"));

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/login", loginRouter);
app.use("/categories", categoriesRouter);
app.use("/user", userRouter);
app.use("/blogs", blogRouter);

app.listen(3001, () => console.log("Server started"));
