import * as express from 'express';
import * as morgan from 'morgan';
import * as request from 'superagent';
import * as passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
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

passport.use(new FacebookStrategy({
  clientID: '477936419276413',
  clientSecret: '67e6845f97240e55f273eaf17fbeb779',
  callbackURL: 'https://localhost:3000/auth/facebook/callback',
}, (accessToken, refreshToken, profile, done) => {
  const result = profile;
}));

app.get('/auth/facebook/', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/movies',
  failureRedirect: '/auth/facebook'
}));

app.use(express.json());
app.use(morgan('combined'));
app.use(compression());
app.use(session(sessionOptions));

app.use('/movies', moviesRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Ready on port 3000!');
});
