require('dotenv').config()
require('./src/auth/auth')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const client = require('./src/db/conexao')
const dbFerramentas = require('./src/db/dbFerramentas')
const dbContas = require('./src/db/dbContas')

const server = express()
const routes = require('./src/routes/routes')

async function iniciar() {
  async function iniciarBD() {
    console.log('[Banco de Dados] : Iniciando ligação com o banco de dados...')
    await client.connect()
    console.log('[Banco de Dados] : Ligação efetuada com sucesso!')
    console.log('[Redis] Ligação efetuada com sucesso!')

    await dbFerramentas.criarTabelaFerramentas()
    await dbContas.criarTabelaContas()

    console.log('[Banco de Dados] : Tabelas criadas com sucesso')
  }

  function iniciarServidor() {
    console.log('[Servidor] : Iniciando servidor...')

    server.use(cors({ exposedHeaders: 'Authorization' }))
    server.use(express.json())
    server.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    )
    server.use('/api', routes)

    server.listen(process.env.PORT, () => {
      console.log('[Servidor] : Servidor iniciado com sucesso!')
      console.log(`[Servidor] : Utilize a porta ${process.env.PORT}`)
    })
  }

  await iniciarBD()
  iniciarServidor()
}

iniciar()
