const sslRedirect = require("heroku-ssl-redirect");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const usersRouter = require("./routes/users");
const db = require("./models");

require("dotenv").config();

app.use(cors());
app.use(sslRedirect());

require("./passport/passport")(passport);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  app.locals.user = req.user;
  next();
});
app.use(morgan("dev"));
app.use(express.json());

//Passport Config
app.use(passport.initialize());

app.use("/auth", usersRouter);

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, () => {
    console.log(`🌎 ==> API server now on port ${PORT}!`);
  });
});
