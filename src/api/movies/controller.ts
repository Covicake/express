import { loadData, saveData } from '../../utils/files';
import { Movie } from '../../classes/Movie';
import { MongoClient, Server, ObjectId } from 'mongodb';

let movies: Movie[];
const forbiddenKeys = ['id', 'like'];
const movieKeys = ['id', 'title', 'like'];
const MONGOURL = 'mongodb://localhost:27017';

loadData((moviesData) => movies = moviesData);

// Deletes any element not present on "movieKeys" and present on "forbiddenKeys" from the request body.
function cleanReq(requestMovie: Movie): Movie {
  Object.keys(requestMovie).forEach((key) => {
    if (!movieKeys.includes(key) || forbiddenKeys.includes(key)) {
      delete requestMovie[key];
    }
  });
  return requestMovie;
}

export function getLikes(): Promise<any> {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGOURL, (err, client) => {
      if (!err) {
        const db = client.db('moviesDB');
        const moviesCollection = db.collection('movies');
        moviesCollection.find({ like: true }).toArray()
          .then((movies) => resolve(movies))
          .catch((findError) => reject(findError));
      } else {
        reject(err);
      }
    });
  });
}

export function getMovies(): Promise<any> {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGOURL, (err, client) => {
      if (!err) {
        const db = client.db('moviesDB');
        const moviesCollection = db.collection('movies');
        moviesCollection.find({}).limit(20).toArray()
          .then(movies => resolve(movies))
          .catch((findError) => reject(findError));
      } else {
        reject(err);
      }
    });
  });
}

export function getMovie(movieId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGOURL, (err, client) => {
      if (!err) {
        const db = client.db('moviesDB');
        const moviesCollection = db.collection('movies');
        moviesCollection.findOne({ _id: new ObjectId(movieId) })
        .then((movie) => resolve(movie))
        .catch((findError) => reject(findError));
      } else {
        reject(err);
      }
    });
  });
}

export function postMovie(body): Promise<any> {
  return new Promise((resolve, reject) => {
    body = cleanReq(body);
    const movieToInsert = { ...body, created: new Date(), updated: new Date()};
    MongoClient.connect(MONGOURL, (err, client) => {
      if (!err) {
        const db = client.db('moviesDB');
        const moviesCollection = db.collection('movies');
        moviesCollection.insertOne(movieToInsert)
          .then(() => resolve())
          .catch((insertError) => reject(insertError));
      } else {
        reject(err);
      }
    });
  });
}

export function modifyMovie(movieId: string, newMovie: Movie): Promise<any> {
  return new Promise((resolve, reject) => {
    newMovie = cleanReq(newMovie);
    MongoClient.connect(MONGOURL, (err, client) => {
      if (!err) {
        const db = client.db('moviesDB');
        const moviesCollection = db.collection('movies');
        moviesCollection.findOneAndUpdate({ _id: new ObjectId(movieId) }, {$set: {...newMovie, updated: new Date()}}, { returnOriginal: false, upsert: false})
          .then(() => resolve())
          .catch((updateError) => reject(updateError));
      } else {
        reject(err);
      }
    });
  });
}

export function deleteMovie(movieId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGOURL, (err, client) => {
      if (!err) {
        const db = client.db('moviesDB');
        const moviesCollection = db.collection('movies');
        moviesCollection.deleteOne({_id: new ObjectId(movieId)})
          .then(() => resolve())
          .catch((deleteError) => reject(deleteError));
      } else {
        reject(err);
      }
    });
  });
}

export function setLike(movieId: string, likeValue: boolean): Promise<any> {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGOURL, (err, client) => {
      if (!err) {
        const db = client.db('moviesDB');
        const moviesCollection = db.collection('movies');
        moviesCollection.findOneAndUpdate({ _id: new ObjectId(movieId)}, {$set: {like: likeValue, updated: new Date()}}, { returnOriginal: false, upsert: false })
          .then(() => resolve())
          .catch((updateError) => reject(updateError));
      } else {
        reject(err);
      }
    });
  });
}