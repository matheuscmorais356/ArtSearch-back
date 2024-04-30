
const express = require("express");
const router = express();

const { searchArtist, genarateRandomArtist, albumTracks } = require("../controllers/ArtistController");

router.get("/", (req, res) => {
  res.send("Hello World")
});

router.get("/api/v1/ping", (req, res) => {
  res.send("pong")
});

router.post("/api/v1/checkmusic", searchArtist);
router.post("/api/v1/randomArtist", genarateRandomArtist);
router.post("/api/v1/albumTracks", albumTracks);

module.exports = router;