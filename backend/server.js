const express = require("express");
const connectDB = require("./database/connection");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const bodyparser = require("body-parser");
const app = express();

dotenv.config({ path: "config.env" });
const port = process.env.PORT || 5000;
app.use(cors());

// log requests
app.use(morgan("tiny"));

// parse request to body parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

//mongodb connection
connectDB();

// load routers
app.use("/", require("./routes/router"));
// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

//serve static files
// app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "build")));

app.get("/koolz", (req, res) => {
  res.send("this is awesome");
});

app.listen(port, () =>
  console.log(
    `Your Server don start to dey run on port: ${port}  oya start work!!!1`
  )
);
