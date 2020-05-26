const client = require('./connection')

module.exports = {
  createTableTools: async () => {
    try {
      console.log('[Database] : Creating the Tool table')
      await client.query(
        `
      CREATE TABLE IF NOT EXISTS tool(
        id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL UNIQUE,
        link VARCHAR NOT NULL,
        description VARCHAR NOT NULL,
        tags text []
      )
      `,
      )
      console.log('[Database] : Table created!')
    } catch (error) {
      console.log('[Database] ERROR!!')
      console.error(error)
    }
  },
  searchTools: async () => {
    try {
      return await client.query(`SELECT * FROM tool`)
    } catch (error) {
      console.log('[Database] ERROR!!')
      console.error(error)
    }
  },
  searchSelectedTool: async (tag) => {
    try {
      return await client.query(
        `
          SELECT *
          FROM tool
          WHERE tags @> ARRAY[$1]::text[]
        `,
        [tag],
      )
    } catch (error) {
      console.log('[Database] ERROR!!')
      console.error(error)
    }
  },
  createTool: async (title, link, description, tags) => {
    try {
      return client.query(
        `
        INSERT INTO tool (title, link, description, tags)
          VALUES 
          ($1, $2, $3, $4)
        RETURNING *
        `,
        [title, link, description, tags],
      )
    } catch (error) {
      console.log('[Database] ERROR!!')
      console.error(error)
    }
  },
  deleteTool: async (id) => {
    try {
      return client.query(
        `
        DELETE FROM tool where id=$1
        `,
        [id],
      )
    } catch (error) {
      console.log('[Database] ERROR!!')
      console.error(error)
    }
  },
}
