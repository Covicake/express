const express = require('express');
const router = express.Router();

router.use(express.json());


router.get('/likes', (req, res) => res.send(controller.getLikes()));

router.get('/', (req, res) => res.send(controller.getMovies()));

router.get('/:id', (req, res) =>res.send(controller.getMovie(req.params.id)));

router.post('/', (req, res) =>{
  if(Object.keys(req.body).length > 0){
    console.log(req.body);
    const newMovie = req.body;

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
          res.error(save_response);
        }else{
          res.json(newMovie);
        }
      });
    }else{
      res.send("Pelicula repetida");
    }
  }else {
    res.status(400).send("Debes enviar algo en el body");
  }
});

router.put('/:id', (req, res) =>{
  const movieId = req.params.id;
  let newMovie = req.body;
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
      res.error(save_response);
    }else{
      res.json(movies[movieIndex]);
    }
  });
});

router.delete('/:id', (req, res) =>{
  const movieId = req.params.id;
  const movieIndex = movies.findIndex(movie => movie.id === movieId);
  if(movieIndex >= 0){
    movies.splice(movieIndex, 1);
    files.saveData(movies, save_response => {
      if(save_response){
        res.error(save_response);
      }else{
        res.send(200)
      }
    });
  }else{
    res.status(400).send("Debes enviar un id valido");
  }

});

router.put('/:id/toggle_like', (req, res) =>{
  const movieId = req.params.id;
  const movieIndex = movies.findIndex(movie => movie.id === movieId);
  if(movieIndex >= 0){
    if(movies[movieIndex].like == false){
      movies[movieIndex].like = true;
    }else{
      movies[movieIndex].like = false;
    }
    files.saveData(movies, save_response => {
      if(save_response){
        res.error(save_response);
      }else{
        res.json(movies[movieIndex]);
      }
    });
  }
});
module.exports = router;
