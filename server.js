require('dotenv').config()
const express = require('express')
const cors = require('cors')
const dbFunctions = require('./src/db/dbFunctions')

const server = express()
const routes = require('./src/routes/routes')

dbFunctions.createTable()

server.use(cors())
server.use(express.json())
server.use('/api', routes)

server.listen(process.env.PORT, () => {
  console.log(`Server rodando na porta ${process.env.PORT}`)
})
