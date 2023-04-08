// npm install express
const express = require('express')
const app = express()
// npm install mysql2
const mysql = require('mysql2/promise')
const cors = require('cors');


app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
 
const listPerPage = 3

const db = {
    host: "db",
    user: "root",
    password: "root",
    database: "mydb",
}

function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage]
}

//need to think about it !
// app.post('/parking', async function (req, res, next) {
//   try {
//     const { _number, area } = req.body
//     const {id} = req.params
    
//     const connection = await mysql.createConnection(db)
//     const sql = 'INSERT INTO parking (_number, area, taken_by) VALUES (?,?,?)'

//     const [rows, fields] = await connection.execute(sql, [])
//     res.json(rows)
//   } catch (err) {
//     next(err, req, res)
//   }
// })

app.get('/parking', async function (req, res, next) {
  try {
    const page = req.query.page ?? 1
    const offset = getOffset(page, listPerPage)
    const connection = await mysql.createConnection(db)
    const sql = "SELECT _number, area, taken_by FROM `parking LIMIT ?,?"
    const [rows, fields] = await connection.query(sql, [ offset, 9])
    res.json({"parking":rows, page})
  } catch (err) {
    next(err, req, res)
  }
})

app.post('/users', async function (req, res, next) {
    try {
      const {first_name, last_name, license_1, license_2, disabled, days, until } = req.body
      const sql = 'INSERT INTO users (first_name, last_name, license_1, license_2, is_disabled, _days, until) VALUES (?,?,?,?,?,?,?)'
      const connection = await mysql.createConnection(db)
      const [rows, fields] = await connection.execute(sql, [first_name, last_name, license_1, license_2, disabled, days, until])
      res.json(rows)
    } catch (err) {
      next(err, req, res)
    }
})

app.put('/users/:id', async function (req, res, next) {
  try {
    const {id} = req.params
    const {first_name, last_name, license_1, license_2, disabled, days, until } = req.body
    const sql = 'UPDATE users SET `first_name` = ?, `last_name` = ?, `license_1` = ?, `license_2` = ?, `is_disabled` = ?, `_days` = ?, `until` = ? WHERE `id` = ?'

    const connection = await mysql.createConnection(db)
    const [rows, fields] = await connection.execute(sql, [first_name, last_name, license_1, license_2, disabled, days, until, id])
    res.json(rows[0])
  } catch (err) {
    next(err, req, res)
  }
})

app.delete('/users/:id', async function (req, res, next) {
  try {
    const {id} = req.params
    const sql = 'DELETE FROM `users` WHERE `id` = ?'
    const connection = await mysql.createConnection(db)
    const [rows, fields] = await connection.execute(sql, [id])
    res.json(rows[0])
  } catch (err) {
    next(err, req, res)
  }
})

app.get('/users/total', async function (req, res, next) {
  try {
    const connection = await mysql.createConnection(db)
    const search = req.query.search ?? undefined
    if(search === undefined){
      sql = "SELECT COUNT(users.id) AS total FROM `users`"
      [rows, fields] = await connection.query(sql, [])
      res.json(rows[0])
    }
    let sql = "SELECT COUNT(users.id) AS total FROM `users` WHERE `first_name` LIKE ?"
    let [rows, fields] = await connection.query(sql, [search + "%"])
    if(rows[0]){
      res.json(rows[0])
    }
    sql = "SELECT COUNT(users.id) AS total FROM `users` WHERE `last_name` LIKE ?"
    [rows, fields] = await connection.query(sql, [search + "%"])
    if(rows[0]){
      res.json(rows[0])
    }
    sql = "SELECT COUNT(users.id) AS total FROM `users` WHERE `license_1` LIKE ? OR `license_2` LIKE ?"
    [rows, fields] = await connection.query(sql, [search + "%"])
    if(rows[0]){
      res.json(rows[0])
    }


  } catch (err) {
    next(err, req, res)
  }
})
app.get('/users/disabled/total', async function (req, res, next) {
  try {
    const connection = await mysql.createConnection(db)
    const sql = "SELECT COUNT(users.id) AS total FROM `users` WHERE `is_disabled` = 1"
    const [rows, fields] = await connection.query(sql, [])
    res.json(rows[0])
  } catch (err) {
    next(err, req, res)
  }
})

app.get('/users', async function (req, res, next) {
  try {

    const search = req.query.search ?? undefined
    const page = req.query.page ?? 1
    const offset = getOffset(page, listPerPage)
    const connection = await mysql.createConnection(db)
    if(search === undefined){
      sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` LIMIT ?,?"
      [rows, fields] = await connection.query(sql, [offset, listPerPage])
      res.json({"users":rows, page})
    }
    let sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `first_name` LIKE ? LIMIT ?,?"
    let [rows, fields] = await connection.query(sql, [search + "%", offset, listPerPage])
    if(rows)
    {
      res.json({"users":rows, page})
    }
    sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `last_name` LIKE ? LIMIT ?,?"
    [rows, fields] = await connection.query(sql, [search + "%", offset, listPerPage])
    if(rows)
    {
      res.json({"users":rows, page})
    }
    sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `license_1` LIKE ? OR `license_2` LIKE ? LIMIT ?,?"
    [rows, fields] = await connection.query(sql, [search + "%", offset, listPerPage])
    if(rows)
    {
      res.json({"users":rows, page})
    }
  } catch (err) {
    next(err, req, res)
  }
})

app.get('/users/disabled/:is_disabled', async function (req, res, next) {
  try {

    const {is_disabled} = req.params
    const page = req.query.page ?? 1
    const offset = getOffset(page, listPerPage)
    const connection = await mysql.createConnection(db)

    let sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `is_disabled` = ? LIMIT ?,?"
    [rows, fields] = await connection.query(sql, [is_disabled, offset, listPerPage])
    if(rows)
    {
      res.json({"users":rows, page})
    }

  } catch (err) {
    next(err, req, res)
  }
})


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  next()
})

app.listen(3300)