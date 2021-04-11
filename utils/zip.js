var fs = require("fs");
const path = require("path");

var z = new require("node-zip");

function zip(callback) {
  let zip = new z();

  let names = [];
  let p = path.join(__dirname, "../downloads");
  fs.readdir(p, (err, files) => {
    files.forEach((file) => {
      names.push(file);
    });
    for (let i = 0; i < names.length; i++) {
      let n = names[i];

      zip.file(n, fs.readFileSync(path.join(__dirname, `../downloads/${n}`)));
    }

    var data = zip.generate({ base64: false, compression: "DEFLATE" });

    // it's important to use *binary* encode
    fs.writeFileSync(
      path.join(__dirname, "../output/songs.zip"),
      data,
      "binary"
    );
    callback();
  });
  return;
}

module.exports = zip;
