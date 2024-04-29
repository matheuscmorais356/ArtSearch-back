const axios = require("axios");

const generateSpotifyToken = async (token = null) => {
  const currentTime = new Date();

  if(token) {
    if(token.expires_in <= currentTime) {
      return token;
    }
  } 

  const bodyData = {
    grant_type: "client_credentials",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  };

  const body = new URLSearchParams(bodyData).toString();

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  
  const response = await axios.post(process.env.URL_TOKEN_SPOTIFY, body, config);
  const data = response.data;

  data.expires_in = new Date(currentTime.getTime() + (data.expires_in * 1000));

  return data;
};

const config = (token) => {
  return {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  }
}

const getArtist = async (artistName, token) => {
  const response = await axios.get(`https://api.spotify.com/v1/search?q=${artistName}&type=artist&limit=1`, config(token));

  const data = response.data.artists.items[0];

  const artistInfos = {
    artistId: data.id,
    name: data.name,
    follows: data.followers.total,
    imageArtist: data.images ? data.images[0].url : null
  };

  return artistInfos;
};

const getTopTracks = async (artistId, token) => {  
  const response  = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=BR`, config(token));
  const data = response.data.tracks;

  const topTracks = [
    {
      name: data[0].name ? data[0].name : null,
      image: data[0].album.images[1].url ? data[0].album.images[1].url : null
    },
    {
      name: data[1].name ? data[1].name : null,
      image: data[1].album.images[1].url ? data[1].album.images[1].url : null
    },
    {
      name: data[2].name ? data[2].name : null,
      image: data[2].album.images[1].url ? data[2].album.images[1].url : null
    },
  ]

  return topTracks;
};

const getLastAlbuns = async (artistId, token) => {
  const response  = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation,appears_on&offset=0&limit=3`, config(token));
  const data = response.data.items;
  
  const lastAlbuns = [
    {
      id: data[0].id,
      name: data[0].name,
      image: data[0].images[1].url
    },
    {
      id: data[1].id,
      name: data[1].name,
      image: data[1].images[1].url
    },
    {
      id: data[2].id,
      name: data[2].name,
      image: data[2].images[1].url
    }
  ];

  return lastAlbuns;
}

const getListOfMusicGenres = async (token) => {
  const response = await axios.get("https://api.spotify.com/v1/recommendations/available-genre-seeds", config(token));

  return response.data.genres;
};

const getListArtistByGenre = async (genre, token) => {
  const response = await axios.get(`https://api.spotify.com/v1/recommendations?seed_genres=${genre}`, config(token));

  return response.data.tracks;
};

const getAlbumTracks = async (albumId, token) => {
  const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, config(token));

  return response.data;
}



module.exports = {
  generateSpotifyToken,
  getArtist,
  getTopTracks,
  getLastAlbuns,
  getListOfMusicGenres,
  getListArtistByGenre,
  getAlbumTracks,
};