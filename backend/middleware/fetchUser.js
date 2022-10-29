const jwt = require('jsonwebtoken')
const JWT_SECRET = "thisismysecret"

const fetchUser = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).send("Please authenticate using a valid token")
    }

    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    } catch (err) {
        res.status(401).send("Please authenticate using a valid token")
    }
}

module.exports = fetchUser