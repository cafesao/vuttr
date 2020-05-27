const express = require('express')

const routes = express.Router()

const vuttrController = require('../controllers/vuttrController')
const middlewareAuth = require('../auth/middlewareAuth')

routes.get('/tools', vuttrController.allTools)
routes.get('/tools/tag', vuttrController.selectTool)
routes.post('/tools', middlewareAuth.bearer, vuttrController.createTool)
routes.delete('/tools/:id', middlewareAuth.bearer, vuttrController.deleteTool)

routes.post('/account/register', vuttrController.register)
routes.post('/account/login', middlewareAuth.local, vuttrController.login)
routes.post('/account/logout', middlewareAuth.bearer, vuttrController.logout)

module.exports = routes
