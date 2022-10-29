const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const JWT_SECRET = "thisismysecret"
const fetchUser = require('../middleware/fetchUser')

// ROUTE 1 : Create a new User using POST :  "/api/auth/createUser" - no login required
router.post('/createUser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {

    let success = false

    // Validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }

    try {

        //Check if user already exists
        let user = await User.findOne({ email: req.body.email })

        if (user) {
            return res.json({ success, message: "User Already Exists" })
        }

        //Create a new User
        const salt = await bcrypt.genSalt(10)
        const secPassword = await bcrypt.hash(req.body.password, salt)

        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: secPassword
        })
        await user.save()

        const data = {
            user: {
                id: user._id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)


        res.json({ success: true, authToken })
    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ success, message: "Internal Server Error" })
    }
})

//// ROUTE 2 : Authenticate a User using POST :  "/api/auth/login" - no login required
router.post('/login', [
    body('email').isEmail(),
    body('password').exists()
], async (req, res) => {

    let success = false

    // Validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }

    const { email, password } = req.body

    try {

        //Check if user exists or not
        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ success, error: "Username or Password is incorrect" })
        }

        //Check if pasword entered is correct
        const passwordMatched = await bcrypt.compare(password, user.password)
        if (!passwordMatched) {
            return res.status(400).json({ success, error: "Username or Password is incorrect" })
        }

        const data = {
            user: {
                id: user._id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET)

        res.json({ success: true, authToken })
    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send("Internal Server Error")
    }
})

//// ROUTE 3 : Show user details using POST :  "/api/auth/getuser" - login required
router.post('/getuser', fetchUser, async (req, res) => {

    const userId = req.user.id

    try {
        let user = await User.findOne({ _id: userId }).select('-password')
        res.send(user)
    }

    catch (err) {
        console.log(err.message)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router