const express = require("express");
const path = require("path");
const hbs = require("hbs");

require("dotenv").config();
const { connect } = require("./src/config/db");
const { botListiner } = require("./src/bot/bot");

const indexRouter = require("./src/routes/index.routes");

const app = express();

connect();
botListiner();

app.set("view engine", "hbs");
app.set("views", path.join(process.env.PWD, "src", "views"));
app.set("trust proxy", 1); // trust first proxy
app.set("cookieName", "sid");
hbs.registerPartials(path.join(process.env.PWD, "src", "views", "partials"));
app.use(express.static(path.join(process.env.PWD, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

app.listen(process.env.PORT, () => {
  console.log("Server has been started on port: ", process.env.PORT);
});
