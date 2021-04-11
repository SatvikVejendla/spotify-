let t =
  "BQDsgcaAbYz3pb6oaBVNcMezEmLWt-0XGfnQegoddxeSI0i35orzYFbUUDjqwPLsbl2J-RDvqd0uMYf-XOWgT5g5eJnzQWQWPYOTV3M-OrFEofj1ALXy7w6Lac9xl5YmySbuaz4KmghypS63804IMtFd_pQN5x0qGdx6BpmaSmn0TmRfUn7sIYRwmabi";

const headers = {
  Authorization: "Bearer " + t,
};
const fetch = require("node-fetch");

let favArtist;
fetch("https://api.spotify.com/v1/me/playlists", { method: "GET", headers })
  .then((res) => res.json())
  .then((body) => {
    let i = body.items.map((i) => i.id);

    Promise.all(
      i.map((a) =>
        fetch(`https://api.spotify.com/v1/playlists/${a}/tracks`, {
          method: "GET",
          headers,
        })
          .then((res) => res.json())
          .then((body) => body.items)
      )
    ).then((output) => {
      let artists = [];
      let artistsId = [];
      let artistsSongs = {};
      let songs = [];

      output = reshape(output);
      let avgPop = 0;
      for (let i = 0; i < output.length; i++) {
        let track = output[i].track;
        let data = output[i];
        let t = track.artists;

        songs.push(track.name);
        avgPop += track.popularity;

        for (let j = 0; j < t.length; j++) {
          if (artists.indexOf(t[j].name) == -1) {
            artists.push(t[j].name);
            artistsId.push(t[j].id);
            artistsSongs[t[j].name] = 1;
          } else {
            artistsSongs[t[j].name]++;
          }
        }
      }
      avgPop /= songs.length;

      songs = [...new Set(songs)];

      let favArtists = getMax(artistsSongs);
      let favIds = [];

      for (let i = 0; i < favArtists.length; i++) {
        favIds.push(artistsId[indexOf(artists, favArtists[i])]);
      }

      fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers,
      })
        .then((res) => res.json())
        .then((body) => {
          let country = body.country;

          let recSongs = [];

          Promise.all(
            favIds.map((a) =>
              fetch(
                `https://api.spotify.com/v1/artists/${a}/top-tracks?market=${country}`,
                {
                  method: "GET",
                  headers,
                }
              ).then((res) => res.json())
            )
          ).then((body) => {
            for (let c = 0; c < body.length; c++) {
              let tmprecSongs = body[c].tracks.map((i) => i.name);

              tmprecSongs = tmprecSongs.filter((x) => indexOf(songs, x) == -1);
              recSongs.push(tmprecSongs);
            }

            console.log(recSongs);

            console.log("Favorite Artist:", favArtists[0]);

            console.log("TOTAL SONGS:", output.length);
          });
        });
    });
  });

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
function indexOf(arr, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      return i;
    }
  }
  return -1;
}
function getMax(json) {
  let max = 0;
  let maxVal;
  let max2 = 0;
  let max2Val;
  let max3 = 0;
  let max3Val;

  for (let i in json) {
    if (json[i] > max) {
      max3 = max2;
      max3Val = max2Val;
      max2 = max;
      max2Val = maxVal;
      max = json[i];
      maxVal = i;
    } else if (json[i] > max2) {
      max3 = max2;
      max3Val = max2Val;
      max2 = json[i];
      max2Val = i;
    } else if (json[i] > max3) {
      max3 = json[i];
      max3Val = i;
    }
  }
  return [maxVal, max2Val, max3Val];
}
