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
    errorSlack={ text: "Error de input"};
  }else if(error == "save err"){
    errorSlack= { text: "Error saving changes"};
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
