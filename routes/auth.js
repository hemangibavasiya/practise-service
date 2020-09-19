const router = require('express').Router();
const User = require('../model/user')
const {registerValidation, loginValidation} = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/register', async (req, res) => {

    // validate body
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // check email is exists
    const emailExist = await User.findOne({ email: req.body.email})
    if(emailExist) return res.status(400).send('Email already exists')

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword
    })
    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (err) {
        res.status(400).send(err)
    }
})



// Login API

router.post('/login', async (req,res) => {
    // validate body
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // check user is exists
    const user = await User.findOne({ email: req.body.email})
    if(!user) return res.status(400).send('Invalid user')

    // Compare password

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Invalid password')

    // Create token and assign it
    const token = jwt.sign({_id: user.email}, process.env.TOKEN_SECRET)
    
    // check user assigned in  https://jwt.io/
    res.header('auth-token', token).send('Logged In!')
    // res.send("Logged In!")

})
module.exports = router