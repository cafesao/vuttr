const client = require('./conexao')

module.exports = {
  criarTabelaContas: async () => {
    try {
      console.log('[Banco de dados] : Criando a tabela Conta')
      await client.query(
        `
          CREATE TABLE IF NOT EXISTS conta(
            id SERIAL PRIMARY KEY,
            usuario VARCHAR NOT NULL UNIQUE,
            senha VARCHAR NOT NULL
          )
        `,
      )
      console.log('[Banco de dados] : Tabela criada!')
    } catch (error) {
      console.log('[Banco de dados] ERROR!!')
      console.log(error)
    }
  },
  criarConta: async (usuario, senha) => {
    try {
      return client.query(
        `
          INSERT INTO conta (usuario, senha)
            VALUES 
            ($1,$2)
          RETURNING *
        `,
        [usuario, senha],
      )
    } catch (error) {
      console.log('[Banco de dados] ERROR!!')
      console.error(error)
    }
  },
  buscarConta: async (usuario) => {
    try {
      return await client.query(
        `
          SELECT *
          FROM conta
          WHERE usuario = $1
        `,
        [usuario],
      )
    } catch (error) {
      console.log('[Banco de dados] ERROR!!')
      console.error(error)
    }
  },
}
