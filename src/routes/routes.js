const express = require('express')

const routes = express.Router()
const vuttrControllers = require('../controllers/vuttrControllers')
const middlewareAuth = require('../auth/middlewareAuth')

routes.get('/allTools', vuttrControllers.allTools)
routes.get('/tools', vuttrControllers.selectTools)
routes.post('/cadastro', vuttrControllers.register)
routes.post('/login', middlewareAuth.local, vuttrControllers.login)
routes.post('/logout', middlewareAuth.bearer, vuttrControllers.logout)
routes.post('/tools', middlewareAuth.bearer, vuttrControllers.createTools)
routes.delete('/tools/:id', middlewareAuth.bearer, vuttrControllers.deleteTools)

module.exports = routes
