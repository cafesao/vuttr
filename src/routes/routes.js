const express = require('express')

const routes = express.Router()
const vuttrControllers = require('../controllers/vuttrControllers')

routes.get('/allTools', vuttrControllers.allTools)
routes.get('/tools', vuttrControllers.selectTools)
routes.post('/tools', vuttrControllers.createTools)
routes.delete('/tools/:id', vuttrControllers.deleteTools)

module.exports = routes
