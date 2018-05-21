import { loadData, saveData } from '../../utils/files';
import { Movie } from '../../classes/Movie';

let movies: Movie[];
const forbiddenKeys = ['id', 'like'];
const movieKeys = ['id', 'title', 'like'];

// Deletes any element not present on "movieKeys" and present on "forbiddenKeys" from the request body.
function cleanReq(requestMovie: Movie): Movie {
  Object.keys(requestMovie).forEach((key) => {
    if (!movieKeys.includes(key) || forbiddenKeys.includes(key)) {
      delete requestMovie[key];
    }
  });
  return requestMovie;
}

loadData((moviesData) => movies = moviesData);

export function getLikes(): Movie[] {
  const likedMovies = movies.filter((movie) => movie.like === true);
  return likedMovies;
}

export function getMovies(): Movie[] {
  return movies;
}

export function getMovie(movieId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const movieResult = movies.find((movie) => movie.id === movieId);
    if (movieResult !== undefined) {
      resolve(movieResult);
    } else {
      reject(400);
    }
  });
}

export function postMovie(body) {
  return new Promise((resolve, reject) => {
    if (Object.keys(body).length > 0) {
      const newMovie = cleanReq(body);
      const movieResult = movies.find((movie) => movie.title.toLowerCase() === newMovie.title.toLowerCase());

      if (movieResult === undefined) {
        newMovie.id = movies.length > 0 ? '' + (Number(movies[movies.length - 1].id) + 1) : '0';
        newMovie.like = false;
        movies.push(newMovie);

        saveData(movies, (saveResponse) => {
          if (saveResponse) {
            reject('save err');
          } else {
            resolve(newMovie);
          }
        });
      } else {
        reject('Pelicula repetida');
      }
    } else {
      reject(400);
    }
  });
}

export function modifyMovie(movieId: string, newMovie: Movie): Promise<any> {
  return new Promise((resolve, reject) => {
    const movieIndex = movies.findIndex((movie) => movie.id === movieId);
    if (!movieIndex) {
      reject(400); // Invalid Id
    } else {
      newMovie = cleanReq(newMovie);
      const movie: Movie = {...movies[movieIndex], ...newMovie};

      movies[movieIndex] = movie;

      saveData(movies, (saveResponse) => {
        if (saveResponse) {
          reject('save err');
        } else {
          resolve(movies[movieIndex]);
        }
      });
    }
  });
}

export function deleteMovie(movieId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const movieIndex = movies.findIndex((movie) => movie.id === movieId);
    if (movieIndex >= 0) {
      movies.splice(movieIndex, 1);
      saveData(movies, (saveResponse) => {
        if (saveResponse) {
          reject('save err');
        } else {
          resolve(200);
        }
      });
    } else {
      reject(400);
    }
  });
}

export function toggleLike(movieId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const movieIndex = movies.findIndex((movie) => movie.id === movieId);
    if (movieIndex >= 0) {
      movies[movieIndex].like = movies[movieIndex].like === false ? true : false;
      saveData(movies, (saveResponse) => {
        if (saveResponse) {
          reject('save err');
        } else {
          resolve(movies[movieIndex]);
        }
      });
    }
  });
}
