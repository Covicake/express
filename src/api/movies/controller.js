const files = require('../../utils/files');

module.exports = {
  getLikes,
  getMovies,
  getMovie,
  postMovie,
  modifyMovie,
  deleteMovie,
  toggleLike,
}

let movies;
const forbiddenKeys = ["id", "like"];
const movieKeys = ["id", "title", "like"];

  //Deletes any element not present on "movieKeys" and present on "forbiddenKeys" from the request body.
function cleanReq(requestMovie){
  Object.keys(requestMovie).forEach(key => {
    if(!movieKeys.includes(key) || forbiddenKeys.includes(key)){
      delete requestMovie[key];
    }
  });
return requestMovie;
}

files.loadData(moviesData => movies = moviesData);


function getLikes(){
  let likedMovies = movies.filter(movie => movie.like == true);
  return likedMovies;
}

function getMovies(){
  return movies;
}

function getMovie(movieId){
  return new Promise((resolve, reject) =>{
    const movie = movies.find(movie => movie.id === movieId);
    if(movie != undefined){
      resolve(movie);
    }else{
      reject(400);
    }
  });
}

function postMovie(body){
  return new Promise((resolve, reject) => {
    if(Object.keys(body).length > 0){
      const newMovie = cleanReq(body);
      const movie = movies.find(movie => movie.title.toLowerCase() === newMovie.title.toLowerCase());

      if(movie == undefined){
        if(movies.length>0){
          newMovie.id = String(Number(movies[movies.length-1].id)+1);
        }else{
          newMovie.id = "0";
        }
        
        newMovie.like = false;
        movies.push(newMovie);

        files.saveData(movies, save_response => {
          if(save_response){
            reject("save err");
          }else{
            resolve(newMovie);
          }
        });
      }else{
        reject("Pelicula repetida");
      }
    }else {
      reject(400);
    }
  });
}

function modifyMovie(movieId, newMovie, callback){
  return new Promise((resolve, reject) => {
    const movieIndex = movies.findIndex(movie => movie.id === movieId);
    if(!movieIndex){
      reject(400); //Id no valido
    }else{
      newMovie = cleanReq(newMovie);
      const movie = {...movies[movieIndex], ...newMovie};

      movies[movieIndex] = movie;

      files.saveData(movies, save_response => {
        if(save_response){
          reject("save err");
        }else{
          resolve(movies[movieIndex]);
        }
      });
    }
  });

}

function deleteMovie(movieId){
  return new Promise((resolve, reject) => {
    const movieIndex = movies.findIndex(movie => movie.id === movieId);
    if(movieIndex >= 0){
      movies.splice(movieIndex, 1);
      files.saveData(movies, save_response => {
        if(save_response){
          reject("save err");
        }else{
          resolve(200);
        }
      });
    }else{
      reject(400);
    }
  });

}

function toggleLike(movieId){
  return new Promise((resolve, reject) => {
    const movieIndex = movies.findIndex(movie => movie.id === movieId);
    if(movieIndex >= 0){
      if(movies[movieIndex].like == false){
        movies[movieIndex].like = true;
      }else{
        movies[movieIndex].like = false;
      }
      files.saveData(movies, save_response => {
        if(save_response){
          reject("save err")
        }else{
          resolve(movies[movieIndex]);
        }
      });
    }
  })
}