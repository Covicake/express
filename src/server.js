const express = require('express');
const app = express();
app.use(express.json());

const forbiddenKeys = ["id", "like"];
const movies = [{title: "Matrix",
                id: "0",
                like: false},
               {title: "Spiderman",
               id: "1",
               like: false}];

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/movies/:id', (req, res) =>{
  const movieId = req.params.id;
  const movie = movies.find(movie => movie.id === movieId);
  if(movie != undefined){
      res.json(movie);
  }else{
    res.send(400);
  }

});

app.post('/movies', (req, res) =>{
  if(Object.keys(req.body).length > 0){
    console.log(req.body);
    const newMovie = req.body;

    const movie = movies.find(movie => movie.title.toLowerCase() === newMovie.title.toLowerCase());
    console.log(movie);
    if(movie == undefined){
      newMovie.id = String(Number(movies[movies.length-1].id)+1);
      if(newMovie.like == undefined){
        newMovie.like = false;
      }
      movies.push(newMovie);
      res.json(newMovie);
    }else{
      res.send("Pelicula repetida");
    }
  }else {
    res.send(400);
  }
});

app.put('/movies/:id', (req, res) =>{
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
  res.json(movies[movieIndex]);
});

app.delete('/movies/:id', (req, res) =>{
  const movieId = req.params.id;
  const movieIndex = movies.findIndex(movie => movie.id === movieId);
  if(movieIndex >= 0){
    movies.splice(movieIndex, 1);
    res.send(200);
  }else{
    res.send(400);
  }

});

app.put('/movies/:id/toggle_like', (req, res) =>{
  const movieId = req.params.id;
  const movieIndex = movies.findIndex(movie => movie.id === movieId);
  if(movieIndex >= 0){
    if(movies[movieIndex].like == false){
      movies[movieIndex].like = true;
    }else{
      movies[movieIndex].like = false;
    }
    res.json(movies[movieIndex]);
  }
});

app.get('/likes', (req, res) =>{
  let liked_movies = movies.filter(movie => movie.like == true);
  res.json(liked_movies);
});
app.listen(3000, () => console.log('Ready on port 3000!'));
