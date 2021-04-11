const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "downloads")));

app.listen(3000);
console.log("LISTENING ON 3000");
