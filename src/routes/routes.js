const express = require('express')

const routes = express.Router()
const vuttrControlador = require('../controllers/vuttrControlador')
const middlewareAuth = require('../auth/middlewareAuth')

routes.get('/todasFerramentas', vuttrControlador.todasFerramentas)
routes.get('/ferramentas', vuttrControlador.selecionarFerramenta)

routes.post('/cadastro', vuttrControlador.registrar)
routes.post('/entrar', middlewareAuth.local, vuttrControlador.entrar)
routes.post(
  '/ferramenta',
  middlewareAuth.bearer,
  vuttrControlador.criarFerramenta,
)
routes.delete(
  '/ferramenta/:id',
  middlewareAuth.bearer,
  vuttrControlador.deletarFerramenta,
)
routes.post('/sair', middlewareAuth.bearer, vuttrControlador.sair)

module.exports = routes
