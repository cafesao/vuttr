const client = require('./conexao')

module.exports = {
  criarTabelaFerramentas: async () => {
    try {
      console.log('[Banco de dados] : Criando a tabela Ferramenta')
      await client.query(
        `
      CREATE TABLE IF NOT EXISTS ferramenta(
        id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL UNIQUE,
        link VARCHAR NOT NULL,
        description VARCHAR NOT NULL,
        tags text []
      )
      `,
      )
      console.log('[Banco de dados] : Tabela criada!')
    } catch (error) {
      console.log('[Banco de dados] ERROR!!')
      console.error(error)
    }
  },
  buscarFerramentas: async () => {
    try {
      return await client.query(`SELECT * FROM ferramenta`)
    } catch (error) {
      console.log('[Banco de dados] ERROR!!')
      console.error(error)
    }
  },
  buscarFerramentaSelecionada: async (tag) => {
    try {
      return await client.query(
        `
          SELECT *
          FROM ferramenta
          WHERE tags @> ARRAY[$1]::text[]
        `,
        [tag],
      )
    } catch (error) {
      console.log('[Banco de dados] ERROR!!')
      console.error(error)
    }
  },
  criarFerramenta: async (title, link, description, tags) => {
    try {
      return client.query(
        `
        INSERT INTO ferramenta (title, link, description, tags)
          VALUES 
          ($1, $2, $3, $4)
        RETURNING *
        `,
        [title, link, description, tags],
      )
    } catch (error) {
      console.log('[Banco de dados] ERROR!!')
      console.error(error)
    }
  },
  deletarFerramenta: async (id) => {
    try {
      return client.query(
        `
        DELETE FROM ferramenta where id=$1
        `,
        [id],
      )
    } catch (error) {
      console.log('[Banco de dados] ERROR!!')
      console.error(error)
    }
  },
}
