const express = require('express')

const routes = express.Router()

const vuttrControlador = require('../controllers/vuttrControlador')
const middlewareAuth = require('../auth/middlewareAuth')

routes.get('/ferramenta/buscar/todas', vuttrControlador.todasFerramentas)
routes.get('/ferramenta/buscar/', vuttrControlador.selecionarFerramenta)
routes.post(
  '/ferramenta/adicionar',
  middlewareAuth.bearer,
  vuttrControlador.criarFerramenta,
)
routes.delete(
  '/ferramenta/remover/:id',
  middlewareAuth.bearer,
  vuttrControlador.deletarFerramenta,
)

routes.post('/conta/cadastro', vuttrControlador.registrar)
routes.post('/conta/entrar', middlewareAuth.local, vuttrControlador.entrar)
routes.post('/conta/sair', middlewareAuth.bearer, vuttrControlador.sair)

module.exports = routes
