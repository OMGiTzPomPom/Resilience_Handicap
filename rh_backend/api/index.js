// npm install express
const express = require('express')
const app = express()
// npm install mysql2
const mysql = require('mysql2/promise')

app.use(express.json())
 
const listPerPage = 24

const db = {
    host: "db",
    user: "root",
    password: "root",
    database: "mydb",
}

function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage]
}

app.post('/register', async function (req, res, next) {
    try {
      const {first_name, last_name, license_1, license_2, disabled, days, until } = req.body
      const sql = 'INSERT INTO users (first_name, last_name, license_1, license_2, is_disabled, _days, until) VALUES (?,?,?,?,?,?,?)'
     
      const connection = await mysql.createConnection(db)
      const [rows, fields] = await connection.execute(sql, [first_name, last_name, license_1, license_2, disabled, days, until])
      return res.json({"status": rows})
    } catch (error) {
      next(error)
    }
})

app.get('/users', async function (req, res, next) {
  try {
    const page = req.query.page ?? 1
    const offset = getOffset(page, listPerPage)
    const sql = 'SELECT * FROM `users` LIMIT ?'
   
    const connection = await mysql.createConnection(db)
    const [rows, fields] = await connection.execute(sql, [listPerPage])
    const meta = {"users":rows, page}
    console.log(rows, meta);
    return res.json(meta)

  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
})

app.listen(3300)