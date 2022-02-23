const path = require('path')
const express = require('express')
const app = express()
const cors = require("cors")
app.use(cors())


const bodyParser = require('body-parser')
require('dotenv').config()
const postCharge = require('./stripe')

const router = express.Router()
const port = 7000

router.post('/stripe/charge', postCharge)
router.all('*', (_, res) =>
  res.json({ message: 'please make a POST request to /stripe/charge' })
)
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(bodyParser.json())
app.use('/api', router)
app.use(express.static(path.join(__dirname, '../build')))

app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, '../build/index.html'))
})

app.listen(port, () => console.log(`server running on port ${port}`))