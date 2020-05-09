const dbFunctions = require('../db/dbFunctions')

module.exports = {
  allTools: async (req, res) => {
    try {
      const tools = await dbFunctions.queryTools()
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
      const tools = await dbFunctions.queryToolsSelect(tag)
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
  createTools: async (req, res) => {
    const { title, link, description, tags } = req.body
    try {
      const tool = await dbFunctions.createTools(title, link, description, tags)
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
      const tool = await dbFunctions.deleteTools(id)

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
