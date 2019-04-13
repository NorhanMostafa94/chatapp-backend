var express = require('express');
var createError = require('http-errors')
var router = express.Router();

const authMiddleWare = require('./../middlewares/authentication')

const User = require('./../model/user');

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const currentUser = await User.findOne({ username });
  if (!currentUser) return next(createError(401));
  const passwordMatch = await currentUser.verifyPassword(password);
  if(!passwordMatch) return next(createError(401));
  const token = await currentUser.generateToken();
  res.send({
    profile: currentUser,
    token
  })
})

router.post('/', (req, res, next) => {
  const user = new User(req.body)
  user.save()
  // User.create(req.body) 
  .then(user => res.send(user))
  .catch(err => next(createError(400, err.message)))
});


router.use(authMiddleWare)

/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find({})
  .then(user => res.send(user))
  .catch(err => next(createError(500, err.message)))
});


router.get('/:userId', (req, res, next) => {
  const id = req.params.userId
  User.findById(id)
    .then(user => res.send(user))
    .catch(err => next(createError(404, err.message)))
});

router.patch('/:userId', (req, res, next) => {
  User.findByIdAndUpdate(req.params.userId, req.body, { new: true })
    .then(user => res.send(user))
    .catch(err => next(createError(400, err.message)))
});

router.delete('/:userId', (req, res, next) => {
  User.findByIdAndDelete(req.params.userId)
    .then(user => res.send(user))
    .catch(err => next(createError(404, err.message)))
})


module.exports = router;
