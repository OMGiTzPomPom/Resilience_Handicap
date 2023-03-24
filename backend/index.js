// npm install express
const express = require('express')
const app = express()
// npm install mysql2
const mysql = require('mysql2/promise')

app.use(express.json())
 
const listPerPage = 24

const db = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "lpiotia2023_resilence_handicap",
}

function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage]
}

function emptyOrRows(rows) {
  if (!rows) {
    return []
  }
  return rows
}

app.post('/register', async function (req, res) {
    console.log(req.body.name)
    res.end()
})

app.post('/login', async function (req, res) {
  console.log(req.body.name)
  res.end()
})

app.get('/get-parking', async function (req, res) {
  try {
    res.json({"parking_number": 21})
  } catch (err) {
    console.error(`Error: `, err.message)
    next(err)
  }
})

app.get('/users', async function (req, res) {
  try {
    const page = req.query.page ?? 1
    const offset = getOffset(page, listPerPage)
    
    const sql = `SELECT id, firstname, lastname FROM users LIMIT ${offset},${listPerPage}`
    const connection = await mysql.createConnection(db)
    const [results, ] = await connection.execute(sql, params)
    const data = emptyOrRows(results)
    const meta = {page}
    res.json(data, meta)

  } catch (err) {
    console.error(`Error: `, err.message)
    next(err)
  }
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  console.error(err.message, err.stack)
  res.status(statusCode).json({ message: err.message })
  return
})

app.listen(3000)