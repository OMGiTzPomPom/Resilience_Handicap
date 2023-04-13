          
          const express = require('express')
          const swaggerDocument = require('./swagger.js');
          const swaggerUi = require('swagger-ui-express');
          const app = express()

        
    
          
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





          app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


          // npm install mysql2
          const mysql = require('mysql2/promise')
          const cors = require('cors');


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

          // app.get('/parking', async function (req, res, next) {
          //   try {
          //     const page = req.query.page ?? 1
          //     const offset = getOffset(page, listPerPage)
          //     const connection = await mysql.createConnection(db)
          //     const sql = "SELECT _number, area, taken_by FROM `parking LIMIT ?,?"
          //     const [rows, fields] = await connection.query(sql, [ offset, 9])
          //     return res.json({"parking":rows, page})
          //   } catch (err) {
          //     next(err, req, res)
          //   }
          // })


          /**
           * @openapi
           * /:
           *   post:
           *     description: add user to database
           *     @param {Object} user - User.
           *     @param {string} user.first_name - First name of the user.
           *     @param {string} user.last_name - Last name of the user.
           *     @param {string} user.license_1 - First car license.
           *     @param {string} user.license_2 - Second car license.
           *     @param {Object} user - User.
           *     @param {string} user.first_name - First name of the user.
           *     @param {string} user.last_name - Last name of the user.
           *     @param {string} user.license_1 - First car license.
           *     @param {string} user.license_2 - Second car license.
           *     responses:
           *       200:
           *         description: Returns a mysterious string.
          */
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

          app.put('/user/:id', async function (req, res, next) {
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

          app.delete('/user/:id', async function (req, res, next) {
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


          app.get('/users', async function (req, res, next) {
            try {
              const page = req.query.page ?? 1
              const offset = getOffset(page, listPerPage)
              const connection = await mysql.createConnection(db)
              let sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` LIMIT ?,?"
              let [rows, fields] = await connection.query(sql, [offset, listPerPage])
              return res.json({"users":rows, page})
            } catch (err) {
              next(err, req, res)
            }
          })

          app.get('/users/total', async function (req, res, next) {
            try {
              const connection = await mysql.createConnection(db)
              let sql = "SELECT COUNT(users.id) AS total FROM `users`"
              let [rows, fields] = await connection.query(sql, [])
              return res.json({"total": rows[0].total})
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

          app.get('/users/first_name/:first_name', async function (req, res, next) {
            try {
              const page = req.query.page ?? 1
              const offset = getOffset(page, listPerPage)
              const {first_name} = req.params
              const sql = 'SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `first_name` LIKE ? LIMIT ?,?'
              const connection = await mysql.createConnection(db)
              const [rows, fields] = await connection.execute(sql, [first_name + "%", offset, listPerPage])
              return res.json(rows)
            } catch (err) {
              next(err, req, res)
            }
          })

          app.get('/users/first_name/total/:first_name', async function (req, res, next) {
            try {
              const {first_name} = req.params
              const sql = 'SELECT COUNT(users.id) AS total FROM `users` WHERE `first_name` LIKE ? LIMIT ?,?'
              const connection = await mysql.createConnection(db)
              let [rows, fields] = await connection.query(sql, [first_name + "%"])
              return res.json({"total": rows[0].total})
            } catch (err) {
              next(err, req, res)
            }
          })

          app.get('/users/last_name/:last_name', async function (req, res, next) {
            try {
              const page = req.query.page ?? 1
              const offset = getOffset(page, listPerPage)
              const {last_name} = req.params
              let sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `last_name` LIKE ? LIMIT ?,?"
              const connection = await mysql.createConnection(db)
              let [rows, fields] = await connection.query(sql, [last_name + "%", offset, listPerPage])
              return res.json({"users":rows, page})
            } catch (err) {
              next(err, req, res)
            }
          })

          app.get('/users/last_name/total/:last_name', async function (req, res, next) {
            try {
              const {last_name} = req.params
              const sql = 'SELECT COUNT(users.id) AS total FROM `users` WHERE `last_name` LIKE ? LIMIT ?,?'
              const connection = await mysql.createConnection(db)
              let [rows, fields] = await connection.query(sql, [last_name + "%"])
              return res.json({"total": rows[0].total})
            } catch (err) {
              next(err, req, res)
            }
          })

          app.get('/user/license/:license', async function (req, res, next) {
            const {license} = req.params
            let sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `license_1` = ? OR `license_2` = ? LIMIT ?,?"
            const connection = await mysql.createConnection(db)
            let [rows, fields] = await connection.query(sql, [license, license])
            return res.json({"users":rows, page})
          })


          app.use((err, req, res, next) => {
            const statusCode = err.statusCode || 500;
            console.error(err.message, err.stack);
            return res.status(statusCode).json({ message: err.message });
          })

          app.listen(3300)