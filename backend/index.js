const express = require('express')
const connectToMongo = require('./db')
const cors = require('cors')
const app = express()

connectToMongo()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

const port = 5000
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})