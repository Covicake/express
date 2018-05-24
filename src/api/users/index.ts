import * as express from 'express';
const router = express.Router();

router.use(express.json());

router.post('/auth', (req, res) => {
    console.log('Hi!');
    res.send({response: 'Hola'});
});

module.exports = router;