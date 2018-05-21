import * as express from 'express';
import { getLikes, getMovies, getMovie, postMovie, modifyMovie, deleteMovie, toggleLike } from './controller';
const router = express.Router();

router.use(express.json());

router.get('/likes', (req, res) => res.send(getLikes()));

router.get('/', (req, res) => res.send(getMovies()));

router.get('/:id', (req, res, next) => {
  getMovie(req.params.id).then((response) => res.send(response))
                                    .catch((response) => next(response));
});

router.post('/', (req, res, next) => {
  postMovie(req.body).then((response) => res.send(response))
                                .catch((response) => next(response));
});

router.put('/:id', (req, res, next) => {
  modifyMovie(req.params.id, req.body).then((response) => res.send(response))
                                                 .catch((response) => next(response));
});

router.delete('/:id', (req, res, next) => { deleteMovie(req.params.id).then((response) => res.send(response))
                                                                                .catch((response) => next(response));
});

router.put('/:id/toggle_like', (req, res, next) => {
  toggleLike(req.params.id).then((response) => res.send(response))
                                      .catch((response) => next(response));
});

module.exports = router;
