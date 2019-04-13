var express = require('express');
var router = express.Router();

const Message = require('../model/message');

/* GET users listing. */
router.get('/',async(req, res, next)=> {
  const userMsg = await Message.find({}).exec();
  console.log(userMsg)
});

// router.post('/',async(req, res, next)=> {
//     const userMsg = await Message.find({}).exec();
//     console.log(userMsg)
//   });

module.exports = router;
