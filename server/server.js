const express = require("express"),
      bodyParser = require("body-parser"),
      path = require("path"),
      app = express(),
      jsonController = require("./jsonController");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("src"));
app.use("/people", jsonController);

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: path.join(__dirname, "..", "src") });
});

// Start server.

app.listen(8080, () => {
    console.log("Server started.");
});

module.exports = app;