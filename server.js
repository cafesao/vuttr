require('dotenv').config()
require('./src/auth/auth')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const client = require('./src/db/connection')
const dbTools = require('./src/db/dbTools')
const dbAccount = require('./src/db/dbAccount')

const server = express()
const routes = require('./src/routes/routes')

async function start() {
  async function startBD() {
    console.log('[Database] : Starting Database connection ...')
    await client.connect()
    console.log('[Database] : Connection successful!')
    console.log('[Redis] Connection successful!')

    await dbTools.createTableTools()
    await dbAccount.createTableAccounts()

    console.log('[Database] : Tables created successfully!')
  }

  function startServer() {
    console.log('[Server] : Starting server ...')

    server.use(cors({ exposedHeaders: 'Authorization' }))
    server.use(express.json())
    server.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    )
    server.use('/api', routes)

    server.listen(process.env.PORT, () => {
      console.log('[Server] : Server started successfully!')
      console.log(`[Server] : Use the port ${process.env.PORT}`)
    })
  }

  await startBD()
  startServer()
}

start()
