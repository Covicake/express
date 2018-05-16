const express = require('express');
const router = express.Router();

router.use(express.json());


router.get('/likes', (req, res) => res.send(controller.getLikes()));

router.get('/', (req, res) => res.send(controller.getMovies()));

router.get('/:id', (req, res) => res.send(controller.getMovie(req.params.id)));

router.post('/', (req, res) => { controller.postMovie(req.body, response =>{
  if(response == 400){
    res.status(400).send("Es necesario enviar algo en el body");
  }else if(response == "save err"){
    res.error("Error while saving");
  }else{
    res.send(response);
  }
  });
});

router.put('/:id', (req, res) =>{ controller.modifyMovie(req.params.id, req.body, response => {
  if(response == "save err"){
    res.error("Error while saving");
  }else{
    res.send(response);
  }
  });
});

router.delete('/:id', (req, res) =>{ controller.deleteMovie(req.params.id, response => {
  if(response == "save err"){
    res.send("Error while saving");
  }else if(response == 400){
    res.status(400).send("Debes enviar un id valido");
  }else{
    res.send(response);
  }
  });
});

router.put('/:id/toggle_like', (req, res) =>{ controller.toggleLike(req.params.id, response =>{
  if(response == "save err"){
    res.error("Error while saving");
  }else{
    res.send(response);
  }
  });
});
module.exports = router;
