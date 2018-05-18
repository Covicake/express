const express = require('express');
const controller = require('./controller.js');
const router = express.Router();

router.use(express.json());

router.get('/likes', (req, res) => res.send(controller.getLikes()));

router.get('/', (req, res) => res.send(controller.getMovies()));

router.get('/:id', (req, res, next) =>{
  controller.getMovie(req.params.id).then(response => res.send(response))
                                    .catch(response => next(response))
});

router.post('/', (req, res, next) => {
  controller.postMovie(req.body).then(response => res.send(response))
                                .catch(response => next(response));
});

router.put('/:id', (req, res, next) =>{ 
  controller.modifyMovie(req.params.id, req.body).then(response => res.send(response))
                                                 .catch(response => next(response));
});

router.delete('/:id', (req, res, next) =>{ controller.deleteMovie(req.params.id).then(response => res.send(response))
                                                                                .catch(response => next(response));
});


router.put('/:id/toggle_like', (req, res, next) =>{ 
  controller.toggleLike(req.params.id).then(response => res.send(response))
                                      .catch(response=> next(response));
});

module.exports = router;
