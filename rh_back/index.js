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


const express = require('express')
const app = express()
// npm install mysql2
const mysql = require('mysql2/promise')
const cors = require('cors');
const swaggerTools = require('swagger-tools');
const swaggerDoc = require('./swagger/swagger.json');
// swaggerRouter configuration
// const options = {
//     controllers: './controllers',
//     useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
// };

swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
          app.use(middleware.swaggerMetadata());
          
          // Validate Swagger requests
          app.use(middleware.swaggerValidator());

          // Route validated requests to appropriate controller
          // app.use(middleware.swaggerRouter(options));

          // Serve the Swagger documents and Swagger UI
          app.use(middleware.swaggerUi());
          app.use(cors())
          app.use(express.urlencoded({extended: true}))
          app.use(express.json())



          //need to think about it !
          // app.post('/parking', async function (req, res, next) {
          //   try {
          //     const { _number, area } = req.body
          //     const {id} = req.params
              
          //     const connection = await mysql.createConnection(db)
          //     const sql = 'INSERT INTO parking (_number, area, taken_by) VALUES (?,?,?)'

          //     const [rows, fields] = await connection.execute(sql, [])
          //     return res.json(rows)
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
              return res.json({"parking":rows, page})
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
                return res.json(rows)
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
              return res.json(rows[0])
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
              return res.json(rows[0])
            } catch (err) {
              next(err, req, res)
            }
          })

          app.get('/users/total', async function (req, res, next) {
            try {
              const connection = await mysql.createConnection(db)
              const search = req.query.search ?? undefined
          
              if(search === undefined || (typeof search === "string" && search === "")){
                let sql = "SELECT COUNT(users.id) AS total FROM `users`"
                let [rows, fields] = await connection.query(sql, [])
                return res.json(rows[0])
              }
              let sql2 = "SELECT COUNT(users.id) AS total FROM `users` WHERE `first_name` LIKE ?"
              let [rows2, fields2] = await connection.query(sql2, [search + "%"])
              if(rows2[0]){
                return res.json(rows2[0])
              }
              let sql3 = "SELECT COUNT(users.id) AS total FROM `users` WHERE `last_name` LIKE ?"
              let [rows3, fields3] = await connection.query(sql3, [search + "%"])
              if(rows3[0]){
                return res.json(rows3[0])
              }
              let sql4 = "SELECT COUNT(users.id) AS total FROM `users` WHERE `license_1` LIKE ? OR `license_2` LIKE ?"
              let [rows4, fields4] = await connection.query(sql4, [search + "%"])
              if(rows4[0]){
                return res.json(rows4[0])
              }
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

              if(search === undefined || (typeof search === "string" && search === "")){
                let sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` LIMIT ?,?"
                let [rows, fields] = await connection.query(sql, [offset, listPerPage])
                console.log("all");
                return res.json({"users":rows, page})
              }

              let sql3 = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `last_name` LIKE ? LIMIT ?,?"
              let [rows3, fields3] = await connection.query(sql3, [search + "%", offset, listPerPage])
              if(rows3.length > 0)
              {
                console.log("last name");
                return res.json({"users":rows3, page})
              }
              let sql4 = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `license_1` LIKE ? OR `license_2` LIKE ? LIMIT ?,?"
              let [rows4, fields4] = await connection.query(sql4, [search + "%", search + "%", offset, listPerPage])
              if(rows4.length > 0)
              {
                console.log("license");
                return res.json({"users":rows4, page})
              }
            } catch (err) {
              next(err, req, res)
            }
          })

          app.get('/user/:id', async function (req, res, next) {
            try {
              const {id} = req.params
              const sql = 'SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `id` = ?'
              const connection = await mysql.createConnection(db)
              const [rows, fields] = await connection.execute(sql, [id])
              return res.json(rows[0])
            } catch (err) {
              next(err, req, res)
            }
          })

          app.get('/users/:first_name', async function (req, res, next) {
            try {
              const {first_name} = req.params
              const sql = 'SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `first_name` = ?'
              const connection = await mysql.createConnection(db)
              const [rows, fields] = await connection.execute(sql, [first_name])
              return res.json(rows[0])
            } catch (err) {
              next(err, req, res)
            }
          })

          app.get('/users/:last_name', async function (req, res, next) {
            try {
              const {last_name} = req.params
              const sql = 'SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `last_name` = ?'
              const connection = await mysql.createConnection(db)
              const [rows, fields] = await connection.execute(sql, [last_name])
              return res.json(rows[0])
            } catch (err) {
              next(err, req, res)
            }
          })

          app.get('/users/:license', async function (req, res, next) {
            try {
              const {license} = req.params
              const sql = 'SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `last_name` = ?'
              const connection = await mysql.createConnection(db)
              const [rows, fields] = await connection.execute(sql, [last_name])
              return res.json(rows[0])
            } catch (err) {
              next(err, req, res)
            }
          })


          app.use((err, req, res, next) => {
            const statusCode = err.statusCode || 500;
            console.error(err.message, err.stack);
            return res.status(statusCode).json({ message: err.message });

          })

          app.listen(3300)

})