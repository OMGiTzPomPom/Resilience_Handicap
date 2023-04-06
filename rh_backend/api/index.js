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
    database: "mydb",
}

function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage]
}

app.post('/register', async function (req, res) {
    const {firstName, lastName } = req.body
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
    console.error(err)
  }
})

app.get('/users', async function (req, res) {
  try {
    const page = req.query.page ?? 1
    const offset = getOffset(page, listPerPage)
    console.log(page, offset);
    const sql = 'SELECT * FROM `users` LIMIT ?,?'
    const connection = await mysql.createConnection(db)
    const [rows, fields] = await connection.execute(sql, [page, offset])
    const meta = {page}
    return res.json(rows, meta)

  } catch (err) {
    console.error(err)
  }
})

app.use((err, req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
})

app.listen(3300)