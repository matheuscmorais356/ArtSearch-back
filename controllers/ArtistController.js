const { 
  generateSpotifyToken, 
  getArtist, 
  getLastAlbuns, 
  getTopTracks, 
  getListOfMusicGenres, 
  getListArtistByGenre,
  getAlbumTracks,
} = require("../services/spotifyServices");

const searchArtist = async (req, res) => {
  const data = req.body

  const token = data.token ? await generateSpotifyToken(data.token) : await generateSpotifyToken()

  const artist = await getArtist(data.artist, token.access_token);
  const topTracks = await getTopTracks(artist.artistId, token.access_token);
  const lastAlbuns = await getLastAlbuns(artist.artistId, token.access_token);

  const artistInfos = {
    ...artist,
    topTracks,
    lastAlbuns,
  };

  res.status(201).json({
    artist: artistInfos,
    token
  });
}

const genarateRandomArtist = async (req, res) => {
  const data = req.body
  
  const token = data.token ? await generateSpotifyToken(data.token) : await generateSpotifyToken()

  const getRandomFromList = (list) => {
    const randomIndex = Math.floor(Math.random() * list.length);
    
    return list[randomIndex];
  }
  
  const musicGenresList = await getListOfMusicGenres(token.access_token);
  const musicGenre = getRandomFromList(musicGenresList);

  const artistByGenreList = await getListArtistByGenre(musicGenre, token.access_token);
  const artistByGenre = getRandomFromList(artistByGenreList);

  const nameArtist = artistByGenre.album.artists[0].name

  // const artist = await getArtist(nameArtist, token.access_token);
  // const topTracks = await getTopTracks(artist.artistId, token.access_token);
  // const lastAlbuns = await getLastAlbuns(artist.artistId, token.access_token);

  // const artistInfos = {
  //   ...artist,
  //   topTracks,
  //   lastAlbuns,
  // };
  
  res.status(201).json({
    nameArtist,
    token
  });
}

const albumTracks = async (req, res) => {
  const data = req.body
  
  const token = data.token ? await generateSpotifyToken(data.token) : await generateSpotifyToken()

  const tracks = await getAlbumTracks(data.album_id, token.access_token);

  const albumTracksList = tracks.items.map((track) =>  ({
    name: track.name,
    duration: track.duration_ms,
    trackNumber: track.track_number
  }))


  res.status(201).json({ 
    tracks: albumTracksList,
    token 
  });
}



module.exports = {
  searchArtist,
  genarateRandomArtist,
  albumTracks
}