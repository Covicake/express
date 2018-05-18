const express = require('express');
const morgan = require('morgan');
const request = require('superagent');
//const cors = require('cors');
const app = express();

//const corsOptions = {};

const moviesRouter = require('./src/api/movies');

app.use(express.json());

//app.use(morgan('combined'));

app.use('/movies', moviesRouter);

app.use((error, req, res, next) => {
  if(!error){
    return next();
  }
  let errorSlack;
  if(error == 400){
    errorSlack = { text: "Error de input", username: "Covierror", icon_emoji: ":ghost:"};
  }else if(error == "save err"){
    errorSlack = { text: "Error saving changes", username: "Covierror", icon_emoji: ":ghost:"};
  }else if(error == "Pelicula repetida"){
    errorSlack =  {text: "La pelicula esta repetida", username: "Covierror", icon_emoji: ":ghost:"};
  }
  request.post('https://hooks.slack.com/services/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')
         .send(errorSlack)
         .end(err => {
           next(err);
         });
});

app.listen(3000, ()=> {
  console.log("Ready on port 3000!");
});
