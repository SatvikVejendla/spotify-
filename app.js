var express = require("express");
const fetch = require("node-fetch");
let request = require("request");
var app = express();
const querystring = require("querystring");
const zip = require("./utils/zip.js");
const getData = require("./utils/getData.js");
const saveSongs = require("./utils/saveSongs.js");
const path = require("path");
require("./app2.js");

let redirect_uri = "http://localhost:8000/callback";
let client_id = "bdcb9c2b07ea4726b966365e68c373b9";
let client_secret = "fb1fb5f87b6f4e89b2185a688cd15e87";

app.use(express.static(path.join(__dirname, "downloads")));

app.get("/default.png", (req, res) => {
  res.sendFile(__dirname + "/public/default.png");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/home.html");
});

app.get("/home", (req, res) => {
  if (req.query.token) {
    res.cookie("access_token", JSON.stringify(req.query.token));
    res.cookie("refresh_token", JSON.stringify(req.query.refresh));
  }
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/download", (req, res) => {
  let cs = req.headers.cookie;
  cs = decodeURIComponent(cs.split("; ")[0].split("access_token=")[1]);
  cs = cs.replace(/"/g, "");
  let id = req.query.id;
  saveSongs(id, cs, () => {
    console.log("SONGS SAVED");
    if (req.query.zip == "true") {
      zip(() => {
        res.download(__dirname + "/output/songs.zip");
      });
    } else {
      res.redirect("/home");
    }
  });
});
app.get("/callback", (req, res) => {
  let code = req.query.code;

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    let a = body;
    let access_token = a.access_token;
    let refresh_token = a.refresh_token;
    res.redirect(`/home?token=${access_token}&refresh=${refresh_token}`);
  });
});

app.get("/login", function (req, res) {
  var scopes = "user-read-private user-read-email playlist-read-private";

  let client_id = "bdcb9c2b07ea4726b966365e68c373b9";
  res.redirect(
    "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      client_id +
      (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent(redirect_uri)
  );
});
console.log("Listening on 8000");
app.listen(8000);

function reshape(arr) {
  let size = arr.length * arr[0].length;
  let oned = new Array(size);
  let counter = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      oned[counter] = arr[i][j];
      counter++;
    }
  }
  return oned;
}
