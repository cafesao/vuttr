require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const dbFunctionsTools = require('./src/db/dbFunctionsTools')
const dbFunctionsAccounts = require('./src/db/dbFunctionsAccounts')

const auth = require('./src/auth/auth')

const server = express()
const routes = require('./src/routes/routes')

dbFunctionsTools.createTableTools()
dbFunctionsAccounts.createTableAccounts()

server.use(cors())
server.use(express.json())
server.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
server.use('/api', routes)

server.listen(process.env.PORT, () => {
  console.log(`Server rodando na porta ${process.env.PORT}`)
})
