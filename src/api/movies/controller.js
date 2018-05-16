const files = require('../../utils/files');

let movies;
const forbiddenKeys = ["id", "like"];

files.loadData(moviesData => movies = moviesData);


function getMovies(){
  return movies;
}

function getMovie(movieId){
  const movie = movies.find(movie => movie.id === movieId);
  if(movie != undefined){
    return movie
  }else{
    return 400;
  }
}

function modifyMovie(){

}

function deleteMovie(){

}

function getLikes(){
  let likedMovies = movies.filter(movie => movie.like == true);
  return likedMovies;
}

function toggleLike(){

}
