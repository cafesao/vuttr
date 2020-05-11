const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy

const { ErroArgumentoInvalido } = require('../error/erros')
const listaNegra = require('../redis/listaNegraControlador')

const dbContas = require('../db/dbContas')

function verificaUsuario(usuario) {
  if (usuario.rows.length === 0) {
    throw new ErroArgumentoInvalido('Usuario ou senha inválida!')
  }
}

async function verificaSenha(senha, senhaHash) {
  const senhaValida = await bcrypt.compare(senha, senhaHash)
  if (!senhaValida) {
    throw new ErroArgumentoInvalido('Usuario ou senha inválida!')
  }
}

async function verificaTokenListaNegra(token) {
  const tokenListaNegra = await listaNegra.hasToken(token)
  if (tokenListaNegra) {
    throw new jwt.JsonWebTokenError('Token inválido por logout!')
  }
}

async function verificaConta(usuario) {
  const buscarUsuario = await dbContas.buscarConta(usuario)
  if (buscarUsuario.rows.length === 0) {
    throw new Error('Não existe uma conta vinculada a esse token')
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'usuario',
      passwordField: 'senha',
      session: false,
    },
    async (usuario, senha, done) => {
      try {
        const usuarioBuscar = await dbContas.buscarConta(usuario)
        verificaUsuario(usuarioBuscar)
        await verificaSenha(senha, usuarioBuscar.rows[0].senha)
        done(null, usuarioBuscar)
      } catch (error) {
        done(error)
      }
    },
  ),
)

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      await verificaTokenListaNegra(token)
      const { usuario } = jwt.verify(token, process.env.CHAVE_JWT)
      verificaConta(usuario)
      done(null, usuario, token)
    } catch (error) {
      done(error)
    }
  }),
)
