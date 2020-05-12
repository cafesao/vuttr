const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dbFerramentas = require('../db/dbFerramentas')
const dbContas = require('../db/dbContas')

const listaNegra = require('../redis/listaNegraControlador')

function criaTokenJWT(usuario) {
  const payload = {
    usuario: usuario.rows[0].usuario,
  }
  const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: '15m' })
  return token
}

module.exports = {
  todasFerramentas: async (req, res) => {
    try {
      const ferramentas = await dbFerramentas.buscarFerramentas()
      if (ferramentas.rows.length > 0) {
        res.json(ferramentas.rows)
      } else {
        res
          .status(404)
          .json({ erro: 'Não contém nenhuma ferramenta no Banco de Dados' })
      }
    } catch (erro) {
      res.status(500).json({ erro: erro.detail })
    }
  },
  selecionarFerramenta: async (req, res) => {
    const tag = req.query.tag
    try {
      const ferramenta = await dbFerramentas.buscarFerramentaSelecionada(tag)
      if (ferramenta.rows.length > 0) {
        res.json(ferramenta.rows)
      } else {
        res.status(404).json({
          erro: 'Não foi possivel encontrar a ferramenta com essa tag',
        })
      }
    } catch (erro) {
      res.status(500).json({ erro: erro.detail })
    }
  },
  registrar: async (req, res) => {
    const { usuario, senha } = req.body
    try {
      const senhaHash = await bcrypt.hash(senha, 12)
      await dbContas.criarConta(usuario, senhaHash)
      res.status(204).send()
    } catch (erro) {
      if (erro.code == 23505) {
        res.status(409).json({ erro: 'Ja existe uma conta com esse usuario!' })
      } else if (erro.code == 23502) {
        res
          .status(400)
          .json({ erro: 'Esta faltando argumentos em sua requisição' })
      } else {
        res.status(500).send()
        console.log('[Server] ERROR!!')
        console.log(erro)
      }
    }
  },
  entrar: async (req, res) => {
    try {
      const token = criaTokenJWT(req.usuario)
      res.set('Authorization', token)
      res.status(204).send()
    } catch (erro) {
      if (!req.usuario) {
        res
          .status(400)
          .json({ erro: 'Esta faltando argumentos em sua requisição' })
      } else {
        res.status(500).send()
        console.log('[Server] ERROR!!')
        console.log(erro)
      }
    }
  },
  sair: async (req, res) => {
    try {
      const token = req.info
      await listaNegra.add(token)
      res.status(204).send()
    } catch (erro) {
      res.status(500).send(erro)
      console.log('[Server] ERROR!!')
      console.log(erro)
    }
  },
  criarFerramenta: async (req, res) => {
    const { title, link, description, tags } = req.body
    try {
      const ferramenta = await dbFerramentas.criarFerramenta(
        title,
        link,
        description,
        tags,
      )
      res.status(201).json(ferramenta.rows[0])
    } catch (erro) {
      if (erro.code == 23505) {
        res
          .status(409)
          .json({ erro: 'Ja existe uma ferramente com esse nome!' })
      } else if (erro.code == 23502) {
        res
          .status(400)
          .json({ erro: 'Esta faltando argumentos em sua requisição' })
      } else {
        res.status(500).json({ erro: erro.detail })
      }
    }
  },
  deletarFerramenta: async (req, res) => {
    const id = req.params.id
    try {
      const ferramenta = await dbFerramentas.deletarFerramenta(id)

      if (ferramenta.rowCount > 0) {
        res.status(204).send()
      } else {
        res.status(404).json({
          erro: 'Não foi possivel encontrar a ferramente com esse id',
        })
      }
    } catch (erro) {
      res.status(500).json({ erro: erro.datail })
    }
  },
}
