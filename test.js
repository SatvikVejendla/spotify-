const fetch = require("node-fetch");

const headers = {
  Authorization:
    "Bearer BQAAv1j0dLYDcTcRgweTlDHGFaXaAHgouSq1gd52x-rNdxmI6D9kAgSWKvT47nvDPrxfd9VXCUz6ddfTUTviw2m-1j-RNYqD5L13ezc6YHssCUqM5kvzcdBocIXThd-BVlRnxZXErRasQjFf33rXEyDfP78XoVJgPi3LJtxDnfFIs3wCXOuQqPr81A-X",
};

fetch("https://api.spotify.com/v1/me/", {
  method: "GET",
  headers,
})
  .then((res) => res.json())
  .then((body) => {
    console.log(body);
  });
