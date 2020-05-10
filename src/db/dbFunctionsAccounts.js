const client = require('./connection')

module.exports = {
  createTableAccounts: async () => {
    return await client.query(
      `
          CREATE TABLE IF NOT EXISTS accounts(
            id SERIAL PRIMARY KEY,
            username VARCHAR NOT NULL UNIQUE,
            password VARCHAR NOT NULL
          )
          `,
    )
  },
  createAccount: async (username, password) => {
    return await client.query(
      `
        INSERT INTO accounts (username, password)
          VALUES 
          ($1,$2)
        RETURNING *
      `,
      [username, password],
    )
  },
  querySelect: async (username) => {
    return await client.query(
      `
        SELECT *
        FROM accounts
        WHERE username = $1
      `,
      [username],
    )
  },
}
