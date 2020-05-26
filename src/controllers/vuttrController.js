const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dbTools = require('../db/dbTools')
const dbAccount = require('../db/dbAccount')

const blackList = require('../redis/blackListController')

function createJWTToken(username) {
  const payload = {
    username: username.rows[0].username,
  }
  const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: '15m' })
  return token
}

module.exports = {
  allTools: async (req, res) => {
    try {
      const tools = await dbTools.searchTools()
      if (tools.rows.length > 0) {
        res.json(tools.rows)
      } else {
        res
          .status(404)
          .json({ error: 'Does not contain any tools in the database' })
      }
    } catch (error) {
      res.status(500).json({ error: error.detail })
    }
  },
  selectTool: async (req, res) => {
    const tag = req.query.tag
    try {
      const tool = await dbTools.searchSelectedTool(tag)
      if (tool.rows.length > 0) {
        res.json(tool.rows)
      } else {
        res.status(404).json({
          error: 'Could not find the tool with this tag',
        })
      }
    } catch (error) {
      res.status(500).json({ error: error.detail })
    }
  },
  register: async (req, res) => {
    const { username, password } = req.body
    try {
      const passwordHash = await bcrypt.hash(password, 12)
      await dbAccount.createAccount(username, passwordHash)
      res.status(204).send()
    } catch (error) {
      if (error.code == 23505) {
        res
          .status(409)
          .json({ error: 'There is already an account with that username!' })
      } else if (error.code == 23502) {
        res.status(400).json({ error: 'Your request is missing arguments' })
      } else {
        res.status(500).send()
        console.log('[Server] ERROR!!')
        console.log(error)
      }
    }
  },
  login: async (req, res) => {
    try {
      const token = createJWTToken(req.username)
      res.set('Authorization', token)
      res.status(204).send()
    } catch (error) {
      if (!req.username) {
        res.status(400).json({ error: 'Your request is missing arguments' })
      } else {
        res.status(500).send()
        console.log('[Server] ERROR!!')
        console.log(error)
      }
    }
  },
  logout: async (req, res) => {
    try {
      const token = req.info
      await blackList.add(token)
      res.status(204).send()
    } catch (error) {
      res.status(500).send(error)
      console.log('[Server] ERROR!!')
      console.log(error)
    }
  },
  createTool: async (req, res) => {
    const { title, link, description, tags } = req.body
    try {
      const tool = await dbTools.createTool(title, link, description, tags)
      res.status(201).json(tool.rows[0])
    } catch (error) {
      if (error.code == 23505) {
        res
          .status(409)
          .json({ error: 'There is already a tool with that name!' })
      } else if (error.code == 23502) {
        res.status(400).json({ error: 'Your request is missing arguments' })
      } else {
        res.status(500).json({ error: error.detail })
      }
    }
  },
  deleteTool: async (req, res) => {
    const id = req.params.id
    try {
      const tool = await dbTools.deleteTool(id)

      if (tool.rowCount > 0) {
        res.status(204).send()
      } else {
        res.status(404).json({
          error: 'It was not possible to find the tool with this id',
        })
      }
    } catch (error) {
      res.status(500).json({ error: error.datail })
    }
  },
}
