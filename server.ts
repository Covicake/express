import * as express from 'express';
import * as morgan from 'morgan';
import * as request from 'superagent';
import * as session from 'express-session';
import * as methodOverride from 'method-override';
import * as compression from 'compression';
import * as cors from 'cors';
import * as moviesRouter from './src/api/movies';

import { SlackMessage } from './src/classes/SlackMessage';

const corsOptions = {};
const sessionOptions = {
  secret: '1234',
};

const app = express();

function errorHandler(err, req, res, next) {
  if (!err) {
    return next();
  }
  let errorSlack: SlackMessage;
  errorSlack = {text: '', username: 'Covierror', icon_emoji: ':ghost:' };
  if (err === 400) {
    errorSlack.text = 'Error de input';
  } else if (err === 'save err') {
    errorSlack.text = 'Error saving changes';
  } else if (err === 'Pelicula repetida') {
    errorSlack.text = 'La pelicula esta repetida';
  }
  request.post('https://hooks.slack.com/services/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')
         .send(errorSlack)
         .end((error) => {
           next(error);
         });
}

function decodeBase64(str) {
  return Buffer.from(str, 'base64').toString();
}

function authentication(req, res, next) {
  if (req.method === 'GET') {
    return next();
  }

  const basicAuth = req.headers.authorization.split(' ')[1];
  const userPassword = decodeBase64(basicAuth).split(':');
  if (userPassword[0] === 'Pepe' && userPassword[1] === 'juan') {
    return next();
  }
  res.status(500).send('Permiso denegado');
}

app.use(express.json());
app.use(morgan('combined'));
app.use(compression());
app.use(authentication);
app.use(session(sessionOptions));

app.use('/movies', moviesRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Ready on port 3000!');
});
