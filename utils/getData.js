const fetch = require("node-fetch");

function getData(req, res) {
  let access_token = req.query.token;
  let refresh_token = req.query.refresh;
  res.cookie("access_token", JSON.stringify(req.query.token));
  res.cookie("refresh_token", JSON.stringify(req.query.refresh));
  const headers = {
    Authorization: "Bearer " + access_token,
  };

  fetch("https://api.spotify.com/v1/me/", {
    method: "GET",
    headers,
  })
    .then((res) => res.json())
    .then((body) => {
      res.cookie("id", body.id);
    });
}

module.exports = getData;
