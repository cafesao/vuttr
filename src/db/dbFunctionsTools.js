const client = require('./connection')

module.exports = {
  createTableTools: () => {
    client.query(
      `
      CREATE TABLE IF NOT EXISTS tools(
        id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL UNIQUE,
        link VARCHAR NOT NULL,
        description VARCHAR NOT NULL,
        tags text []
      )
      `,
    )
  },
  queryTools: async () => {
    return await client.query(`SELECT * FROM tools`)
  },
  queryToolsSelect: async (tag) => {
    return await client.query(
      `
        SELECT *
        FROM tools
        WHERE tags @> ARRAY[$1]::text[]
      `,
      [tag],
    )
  },
  createTools: async (title, link, description, tags) => {
    return client.query(
      `
      INSERT INTO tools (title, link, description, tags)
        VALUES 
        ($1, $2, $3, $4)
      RETURNING *
      `,
      [title, link, description, tags],
    )
  },
  deleteTools: async (id) => {
    return client.query(
      `
      DELETE FROM tools where id=$1
      `,
      [id],
    )
  },
}
