const client = require('./connection')

module.exports = {
  createTableAccounts: async () => {
    try {
      console.log('[Database] : Creating the Account table...')
      await client.query(
        `
          CREATE TABLE IF NOT EXISTS account(
            id SERIAL PRIMARY KEY,
            username VARCHAR NOT NULL UNIQUE,
            password VARCHAR NOT NULL
          )
        `,
      )
      console.log('[Database] : Table created!')
    } catch (error) {
      console.log('[Database] ERROR!!')
      console.log(error)
    }
  },
  createAccount: async (username, password) => {
    try {
      return client.query(
        `
          INSERT INTO account (username, password)
            VALUES 
            ($1,$2)
          RETURNING *
        `,
        [username, password],
      )
    } catch (error) {
      console.log('[Database] ERROR!!')
      console.error(error)
    }
  },
  searchAccount: async (username) => {
    try {
      return await client.query(
        `
          SELECT *
          FROM account
          WHERE username = $1
        `,
        [username],
      )
    } catch (error) {
      console.log('[Database] ERROR!!')
      console.error(error)
    }
  },
}
