const express = require('express')

const routes = express.Router()

const vuttrController = require('../controllers/vuttrController')
const middlewareAuth = require('../auth/middlewareAuth')

routes.get('/tool/search/all', vuttrController.allTools)
routes.get('/tool/search/', vuttrController.selectTool)
routes.post('/tool/add', middlewareAuth.bearer, vuttrController.createTool)
routes.delete(
  '/tool/remove/:id',
  middlewareAuth.bearer,
  vuttrController.deleteTool,
)

routes.post('/account/register', vuttrController.register)
routes.post('/account/login', middlewareAuth.local, vuttrController.login)
routes.post('/account/logout', middlewareAuth.bearer, vuttrController.logout)

module.exports = routes
