// npm install express
const express = require('express')
const app = express()
// npm install mysql2
const mysql = require('mysql2/promise')
const cors = require('cors');


app.use(cors())
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


app.post('/users', async function (req, res, next) {
    try {
      const {first_name, last_name, license_1, license_2, disabled, days, until } = req.body
      const sql = 'INSERT INTO users (first_name, last_name, license_1, license_2, is_disabled, _days, until) VALUES (?,?,?,?,?,?,?)'
      const connection = await mysql.createConnection(db)
      const [rows, fields] = await connection.execute(sql, [first_name + "%", last_name + "%", license_1.replace('-',''), license_2.replace('-',''), disabled, days, until])
      return res.json(rows[0])
    } catch (err) {
      next(err, req, res)
    }
})

app.put('/users:id', async function (req, res, next) {
  try {
    const {id} = req.params
    const {first_name, last_name, license_1, license_2, disabled, days, until } = req.body
    const sql = 'UPDATE users SET `first_name` = ?, `last_name` = ?, `license_1` = ?, `license_2` = ?, `is_disabled` = ?, `_days` = ?, `until` WHERE `id` = ?'
   
    const connection = await mysql.createConnection(db)
    const [rows, fields] = await connection.execute(sql, [first_name + "%", last_name + "%", license_1.replace('-',''), license_2.replace('-',''), disabled, days, until, id])
    return res.json(rows[0])
  } catch (err) {
    next(err, req, res)
  }
})

app.delete('/users:id', async function (req, res, next) {
  try {
    const {id} = req.params
    const sql = 'DELETE FROM `users` WHERE `id` = ?'
    const connection = await mysql.createConnection(db)
    const [rows, fields] = await connection.execute(sql, [id])
    return res.json(rows[0])
  } catch (err) {
    next(err, req, res)
  }
})

app.get('/users/total', async function (req, res, next) {
  try {
    const connection = await mysql.createConnection(db)
    const first_name = req.query.firstName ?? undefined
    const last_name = req.query.lastName  ?? undefined
    const is_disabled = req.query.isDisabled ?? undefined

    if(first_name !== undefined && last_name !== undefined && is_disabled !== undefined){
      
      const sql = "SELECT COUNT(users.id) AS total FROM `users` WHERE `first_name` LIKE ? AND `last_name` LIKE ? AND `is_disabled` = ?"
   
      const [rows, fields] = await connection.query(sql, [first_name + "%", last_name + "%", is_disabled])
      res.json(rows[0])
    }else     if(first_name !== undefined && last_name !== undefined){

      const sql = "SELECT COUNT(users.id) AS total FROM `users` WHERE `first_name` LIKE ? AND `last_name` LIKE ?"
   
      const [rows, fields] = await connection.query(sql, [first_name + "%", last_name])
      res.json(rows[0])
    }else     if(first_name !== undefined && is_disabled !== undefined){

      const sql = "SELECT COUNT(users.id) AS total FROM `users` WHERE `first_name` LIKE ? AND `is_disabled` = ?"
   
      const [rows, fields] = await connection.query(sql, [first_name + "%", is_disabled])
      res.json(rows[0])
    }else     if(last_name !== undefined && is_disabled !== undefined){

      const sql = "SELECT COUNT(users.id) AS total FROM `users` WHERE `last_name` LIKE ? AND `is_disabled` = ?"
   
      const [rows, fields] = await connection.query(sql, [last_name + "%", is_disabled])
      res.json(rows[0])
    }else     if(first_name !== undefined){
    
      const sql = "SELECT COUNT(users.id) AS total FROM `users` WHERE `first_name` LIKE ?"
   
      const [rows, fields] = await connection.query(sql, [first_name + "%"])
      res.json(rows[0])
    }else     if(last_name !== undefined){

      const sql = "SELECT COUNT(users.id) AS total FROM `users` WHERE `last_name` LIKE ?"
   
      const [rows, fields] = await connection.query(sql, [last_name + "%"])
      res.json(rows[0])
    }else     if(is_disabled !== undefined){
   
      const sql = "SELECT COUNT(users.id) AS total FROM `users` WHERE `is_disabled` = ?"
      const [rows, fields] = await connection.query(sql, [is_disabled])
      res.json(rows[0])
    }else{
   
      const sql = "SELECT COUNT(users.id) AS total FROM `users`"
   
      const [rows, fields] = await connection.query(sql, [])
      res.json(rows[0])
    }


  } catch (err) {
    next(err, req, res)
  }
})

app.get('/users', async function (req, res, next) {
  try {

    const first_name = req.query.firstName ?? undefined
    const last_name = req.query.lastName  ?? undefined
    const is_disabled = req.query.isDisabled ?? undefined
    const license_1 = req.query.licenseOne  ?? undefined
    const license_2 = req.query.licenseTwo  ?? undefined

    const page = req.query.page ?? 1
    const offset = getOffset(page, listPerPage)
    const connection = await mysql.createConnection(db)
    console.log(first_name, last_name);
    if(first_name !== undefined && last_name !== undefined && is_disabled !== undefined){
      console.log("1");
      const sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `first_name` LIKE ? AND `last_name` LIKE ? AND `is_disabled` = ? LIMIT ?,?"
   
      
      const [rows, fields] = await connection.query(sql, [first_name + "%", last_name + "%", is_disabled, offset, listPerPage])
   
     res.json({"users":rows, page})
    }else     if(first_name !== undefined && last_name !== undefined){
      console.log("2");
      const sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `first_name` LIKE ? AND `last_name` LIKE ? LIMIT ?,?"
   
      
      const [rows, fields] = await connection.query(sql, [first_name + "%", last_name + "%", offset, listPerPage])
   
     res.json({"users":rows, page})
    }else     if(first_name !== undefined && is_disabled !== undefined){
      console.log("3");
      const sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `last_name` LIKE ? AND `is_disabled` = ? LIMIT ?,?"
   
      
      const [rows, fields] = await connection.query(sql, [first_name + "%", is_disabled, offset, listPerPage])
   
     res.json({"users":rows, page})
    }else     if(last_name !== undefined && is_disabled !== undefined){
      console.log("4");
      const sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `last_name` LIKE ? AND `is_disabled` = ? LIMIT ?,?"
   
      
      const [rows, fields] = await connection.query(sql, [last_name + "%", is_disabled, offset, listPerPage])
   
     res.json({"users":rows, page})
    }else     if(first_name !== undefined){
      console.log("5");
      const sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `first_name` LIKE ? LIMIT ?,?"
   
      
      const [rows, fields] = await connection.query(sql, [first_name + "%", offset, listPerPage])
   
     res.json({"users":rows, page})
    }else     if(last_name !== undefined){
      console.log("6");
      const sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `last_name` LIKE ? LIMIT ?,?"
   
      
      const [rows, fields] = await connection.query(sql, [last_name + "%", offset, listPerPage])
   
     res.json({"users":rows, page})
    }else     if(is_disabled !== undefined){
      console.log("7");
      const sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `is_disabled` = ? LIMIT ?,?"
   
      
      const [rows, fields] = await connection.query(sql, [is_disabled, offset, listPerPage])
   
     res.json({"users":rows, page})
    }else     if(license_1 !== undefined){
      console.log("8");
      const sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `license_1` LIKE ? LIMIT ?,?"
   
      
      const [rows, fields] = await connection.query(sql, [license_1.replace('-','') + "%", offset, listPerPage])
   
     res.json({"users":rows, page})
    }else     if(license_2 !== undefined){
      console.log("here 9");
      const sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `license_2` LIKE ? LIMIT ?,?"
   
      
      const [rows, fields] = await connection.query(sql, [license_2.replace('-','') + "%", offset, listPerPage])
   
     res.json({"users":rows, page})
    }else{
      console.log("here 10");
      const sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` LIMIT ?,?"
   
      
      const [rows, fields] = await connection.query(sql, [offset, listPerPage])
   
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