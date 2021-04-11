const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const https = require("https");
const fs = require("fs");
const path = require("path");

let a =
  "BQDfC5Ho0qaWGFxnXBqZ6kWsBBxRU3HEXTTUjjlx6fhXf4bKTjv9LT21AVyMn9wfnvIOSXFA4bHhYSVAdY8_ps3_zDhWI3YKYMt7rL6UpMKIwgFLilhOHzcgaf1xn5O4DJpSb26xom0CWYjULmDfqAB_JRPWFnxjvDFzJmIrQXZgFFxkXQ";

const headers = {
  Authorization: "Bearer " + a,
};

const base = "https://freemp3cloud.com/";

async function download(arr, callback) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  for (let z = 0; z < arr.length; z++) {
    const page = await browser.newPage();
    await page.goto(base);

    let str = arr[z];
    await page.waitForSelector('input[type="text"]');

    await page.type('input[type="text"]', str);

    await page.click('button[type="submit"]');

    await page.waitForSelector(".play-item > div > div > a");
    const songs = await page.evaluate(() => {
      let a = Array.from(
        document.querySelectorAll(".play-item > div > div > a")
      );
      let b = a.map((x) => {
        return x.href;
      });
      return b;
    });
    var filename = str.replace(/[^a-z0-9]/gi, "").toLowerCase();
    let p = path.join(__dirname, `../downloads/${filename}.mp3`);
    const file = fs.createWriteStream(p, function (err) {});
    const request = https.get(songs[0], function (response) {
      response.pipe(file);
    });
  }
  await browser.close();
  callback();
}

function saveSongs(id, token, callback) {
  headers.Authorization = "Bearer " + token;
  fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    method: "GET",
    headers,
  })
    .then((res) => res.json())
    .then((body) => {
      let songs = body.items;
      songs = songs.map((i) => {
        let artist = i.track.artists[0].name;
        return i.track.name + " " + artist;
      });
      downloadSongs(songs, callback);
    });
}
async function downloadSongs(songs, callback) {
  let dir = path.join(__dirname, `../downloads`);
  fs.rmdirSync(dir, { recursive: true });
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  await download(songs, callback);
}

module.exports = saveSongs;
