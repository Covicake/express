const files = require('../../utils/files');

let movies;
const forbiddenKeys = ["id", "like"];

files.loadData(moviesData => movies = moviesData);


function getLikes(){
  let likedMovies = movies.filter(movie => movie.like == true);
  return likedMovies;
}

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

function postMovie(body, callback){
  if(Object.keys(body).length > 0){
    console.log(body);
    const newMovie = body;

    const movie = movies.find(movie => movie.title.toLowerCase() === newMovie.title.toLowerCase());
    console.log(movie);
    if(movie == undefined){
      if(movies.length>0){
        newMovie.id = String(Number(movies[movies.length-1].id)+1);
      }else{
        newMovie.id = "0";
      }
      if(newMovie.like == undefined){
        newMovie.like = false;
      }
      movies.push(newMovie);

      files.saveData(movies, save_response => {
        if(save_response){
          callback("save err");
        }else{
          callback(newMovie);
        }
      });
    }else{
      callback("Pelicula repetida");
    }
  }else {
    callback(400);
  }
}

function modifyMovie(movieId, newMovie, callback){
  const movieIndex = movies.findIndex(movie => movie.id === movieId);
  newMovie.id = movies[movieIndex].id;
  const movies_keys = Object.keys(movies[movieIndex]);
  Object.keys(newMovie).forEach(key => {
    if(!movies_keys.includes(key) || forbiddenKeys.includes(key)){
      delete newMovie[key];
    }
  });
  const movie = {...movies[movieIndex], ...newMovie}
  movies[movieIndex] = movie;
  files.saveData(movies, save_response => {
    if(save_response){
      callback("save err");
    }else{
      callback(movies[movieIndex]);
    }
  });
}

function deleteMovie(movieId, callback){
  const movieIndex = movies.findIndex(movie => movie.id === movieId);
  if(movieIndex >= 0){
    movies.splice(movieIndex, 1);
    files.saveData(movies, save_response => {
      if(save_response){
        callback("save err");
      }else{
        callback(200);
      }
    });
  }else{
    callback(400);
  }
}



function toggleLike(movieId, callback){
  const movieIndex = movies.findIndex(movie => movie.id === movieId);
  if(movieIndex >= 0){
    if(movies[movieIndex].like == false){
      movies[movieIndex].like = true;
    }else{
      movies[movieIndex].like = false;
    }
    files.saveData(movies, save_response => {
      if(save_response){
        callback("save err")
      }else{
        callback(movies[movieIndex]);
      }
    });
  }
}
