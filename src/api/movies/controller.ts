import { loadData, saveData } from '../../utils/files';
import { Movie } from '../../classes/Movie';
import { MongoClient, Server, ObjectId } from 'mongodb';

let movies: Movie[];
const forbiddenKeys = ['id', 'like'];
const movieKeys = ['id', 'title', 'like'];
const MONGOURL = 'mongodb://localhost:27017';

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
    MongoClient.connect(MONGOURL, (err, client) => {
      if (!err) {
        const db = client.db('moviesDB');
        const moviesCollection = db.collection('movies');
        moviesCollection.findOne({ _id: new ObjectId(movieId) })
        .then((movie) => resolve(movie))
        .catch((error) => reject(error));
      } else {
        reject(err);
      }
    });
  });
}

export function postMovie(body): Promise<any> {
  return new Promise((resolve, reject) => {
    const movieToInsert = { ...body, created: new Date(), updated: new Date()};
    MongoClient.connect(MONGOURL, (err, client) => {
      if (!err) {
        const db = client.db('moviesDB');
        const moviesCollection = db.collection('movies');
        moviesCollection.insertOne(movieToInsert)
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
        reject(err);
      }
    });
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
