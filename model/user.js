const mongoose = require('mongoose');
var validator = require('validator');
const integerValidator = require('mongoose-integer');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const jwt = require('jsonwebtoken');
const util = require('util');

const secretKey = 'fghjhgfghj';

const signPromise = util.promisify(jwt.sign)
const verifyToken = util.promisify(jwt.verify)
const userScheme = new mongoose.Schema({
    username: {
        type: String,
        // required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: validator.isEmail,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
        integer: true,
        min: 18,
    },
    gender: {
        type: String,
        enum: ['female', 'male', 'n/a'],
        lowercase: true,
        default: 'n/a',
    },
    countries: {
        type: String,
        // required:true
    }
},
    {
        autIndex: true
    }
)

userScheme.plugin(integerValidator);

const hashPassword = (password) => {
    return bcrypt.hash(password, saltRounds)
}

userScheme.method('verifyPassword', function (password) {
    const currentUser = this;
    return bcrypt.compare(password, currentUser.password);
})

userScheme.static('verifyToken', async function(token){
    const userModel = this;
    const decoded = await verifyToken(token,secretKey);
    const userId = decoded._id;
    return userModel.findById(userId);
})

userScheme.method('generateToken', function () {
    const currentUser = this;
    return signPromise({ _id: currentUser._id }, secretKey,{
        expiresIn: '2h'
    })
})

userScheme.pre('save', async function () {
    //   debugger;
    // debugger;
    const currentUser = this;
    if (currentUser.isNew) {
        currentUser.password = await hashPassword(currentUser.password)
    }
    console.log(this);
})

const userModel = mongoose.model('User', userScheme);

module.exports = userModel;