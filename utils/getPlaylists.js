function getPlaylists(headers) {
  return fetch("https://api.spotify.com/v1/me/playlists", {
    method: "GET",
    headers,
  })
    .then((res) => res.json())
    .then((body) => {
      return body;
    });
}
module.exports = getPlaylists;
