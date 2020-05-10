const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dbFunctionsTools = require('../db/dbFunctionsTools')
const dbFunctionsAccounts = require('../db/dbFunctionsAccounts')
const blacklist = require('../redis/blacklistController')

function criaTokenJWT(user) {
  const payload = {
    username: user.rows[0].username,
  }
  const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: '15m' })
  return token
}

module.exports = {
  allTools: async (req, res) => {
    try {
      const tools = await dbFunctionsTools.queryTools()
      if (tools.rows.length > 0) {
        res.json(tools.rows)
      } else {
        res
          .status(404)
          .json({ resposta: 'Não contém nenhuma ferramenta no Banco de Dados' })
      }
    } catch (erro) {
      res.status(500).json({ resposta: erro.detail })
    }
  },
  selectTools: async (req, res) => {
    const tag = req.query.tag
    try {
      const tools = await dbFunctionsTools.queryToolsSelect(tag)
      if (tools.rows.length > 0) {
        res.json(tools.rows)
      } else {
        res.status(404).json({
          resposta: 'Não foi possivel econtrar a ferramenta com essa tag',
        })
      }
    } catch (erro) {
      res.status(500).json({ resposta: erro.detail })
    }
  },
  register: async (req, res) => {
    const { username, password } = req.body
    try {
      const passwordHash = await bcrypt.hash(password, 12)
      await dbFunctionsAccounts.createAccount(username, passwordHash)
      res.status(201).send()
    } catch (error) {
      res.status(500).json({ erro: error.message })
    }
  },
  login: async (req, res) => {
    const token = criaTokenJWT(req.user)
    res.set('Authorization', token)
    res.status(204).send()
  },
  logout: async (req, res) => {
    try {
      const token = req.info
      await blacklist.add(token)
      res.status(204).send()
    } catch (error) {
      res.status(500).json(error)
    }
  },
  createTools: async (req, res) => {
    const { title, link, description, tags } = req.body
    try {
      const tool = await dbFunctionsTools.createTools(
        title,
        link,
        description,
        tags,
      )
      res.json(tool.rows[0])
    } catch (erro) {
      if (erro.code == 23505) {
        res
          .status(409)
          .json({ resposta: 'Ja existe uma ferramente com esse nome!' })
      } else if (erro.code == 23502) {
        res
          .status(400)
          .json({ resposta: 'Esta faltando argumentos em sua requisição' })
      } else {
        res.status(500).json({ resposta: erro.detail })
      }
    }
  },
  deleteTools: async (req, res) => {
    const id = req.params.id
    try {
      const tool = await dbFunctionsTools.deleteTools(id)

      if (tool.rowCount > 0) {
        res.status(204).send()
      } else {
        res.status(404).json({
          resposta: 'Não foi possivel encontrar a ferramente com esse id',
        })
      }
    } catch (erro) {
      res.status(500).json({ resposta: erro.datail })
    }
  },
}
