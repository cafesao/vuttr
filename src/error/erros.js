class ErroArgumentoInvalido extends Error {
  constructor(mensagem) {
    super(mensagem)
    this.name = 'ErroArgumentoInvalido'
  }
}

class ErroInternoServidor extends Error {
  constructor(mensagem) {
    super(mensagem)
    this.name = 'ErroInternoServidor'
  }
}

module.exports = {
  ErroInternoServidor,
  ErroArgumentoInvalido,
}
