          
          require("dotenv").config()
          const http = require('http');
          const express = require('express')
          const swaggerDocument = require('./swagger.js');
          const swaggerUi = require('swagger-ui-express');
          const app = express()
          const crypto = require('crypto');
          // npm install mysql2
          const mysql = require('mysql2/promise')
          const cors = require('cors');
          const basicAuth = require('express-basic-auth');
          const fs = require('fs');

          const sslOptions = {
            cert: fs.readFileSync('client-cert.pem'),
            key: fs.readFileSync('client-key.pem'),
            rejectUnauthorized: false
          };

          app.use('/api/docs', basicAuth({
            users: { 'root': 'root' },
            challenge: true
          }), swaggerUi.serve, swaggerUi.setup(swaggerDocument));



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

          
          




          app.use(cors())
          app.use(express.urlencoded({extended: true}))
          app.use(express.json())

          /**
           * @openapi
           * /parking:
           *   post:
           *     summary: Reserve a parking spot.
           *     description: |
           *       Reserves a parking spot for the given license plate if the user is registered and has an active reservation.
           *     requestBody:
           *       description: License plate number encrypted in aes-128-cbc as base64 format.
           *       required: true
           *       content:
           *         application/json:
           *           schema:
           *             type: object
           *             properties:
           *               plate:
           *                 type: string
           *     responses:
           *       '204':
           *         description: No content.
           *       '404':
           *         description: Not found.
           *       '500':
           *         description: Internal server error.
           */
          app.post('/api/parking', async function (req, res, next) {
            try {
             
            const { plate } = req.body
            console.log(plate);
            const python_key = Buffer.from(process.env.KEY, "base64")
            const encryptionKey = python_key.slice(16);
            const decodedToken = Buffer.from(plate, 'base64');
            
            const version = decodedToken.readUInt8(0);
            const timestamp = decodedToken.readBigUInt64BE(1);
            const iv = decodedToken.slice(9, 25);
            const ciphertext = decodedToken.slice(25, -32);
            const hmacSignature = decodedToken.slice(-32);
            const decipher = crypto.createDecipheriv('aes-128-cbc', encryptionKey, iv);
            let decrypted = decipher.update(ciphertext);
            decrypted += decipher.final();
           
             
            let connection = await mysql.createConnection(db, {
              host: 'localhost',
              user: 'root',
              password: 'root',
              database: 'mydb',
              ssl: sslOptions
            })
          
            let [rows, fields] = await connection.query("SELECT id, until, is_disabled, _days FROM `users` WHERE `license_1` = ? OR `license_2` = ?", [decrypted.toString(), decrypted.toString()])

            if(rows.length > 0){
              let current_date = Date.now();
              let row = JSON.parse(JSON.stringify(rows[0]))

              if (new Date(row.until) >= current_date){
                const area = row._days[new Date().toLocaleString('en-us', {  weekday: 'long' })]
                if(row.is_disabled) {
                  let [row, fields] = await connection.query("SELECT number FROM `parking` WHERE `area` = ? AND `is_disabled` = 1 AND `plate` = '' LIMIT 1", [area])
   
                  if(row.length > 0){
                    const sql = 'UPDATE parking SET `plate` = ? WHERE `area` = ? AND `number` = ? AND `is_disabled` = 1'
                    await connection.execute(sql, [decrypted.toString(), area, row[0].number])
                    try {
                      const postData = JSON.stringify({
                        area: area,
                        place: row[0].number
                      });
                        const options = {
                            host: '192.168.143.68',
                            port: 9090,
                            path: '/place',
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': postData.length
                            }
                        };
                        const req = http.request(options, (res) => {
                          res.on('data', function (data) {
                            process.stdout.write(data)
                
                          });

                      });
                      req.on('error', function (error) {
                        console.log(error);
                      });
                      req.write(postData);
                      req.end();
                    } catch (error) {
                      console.log(error);
                    }
                  }
              
                } else {
                  let [row, fields] = await connection.query("SELECT number FROM `parking` WHERE `area` = ? AND `is_disabled` = 0 AND `plate` = '' LIMIT 1", [area])
        
                  if(row.length > 0){
                    const sql = 'UPDATE parking SET `plate` = ? WHERE `area` = ? AND `number` = ? AND `is_disabled` = 0'
                    await connection.execute(sql, [decrypted.toString(), area, row[0].number])
                    try {

                    //  curl -X POST -H "Content-Type: application/json" -d '{"area":"a","place":"0"}' 192.168.143.68:9090/place
                    const postData = JSON.stringify({
                      area: area,
                      place: row[0].number
                    });
                    const options = {
                      host: '192.168.143.68',
                      port: 9090,
                      path: '/place',
                      method: 'POST',
                      headers: {
                      'Content-Type': 'application/json',
                      'Content-Length': postData.length
                      }
                  };
                        const req = http.request(options, (res) => {
              
 
                          res.on('data', function (data) {
                            process.stdout.write(data)
                
                          });
                          res.on('error', function (error) {
                              console.log(error);
                          });
                      });
                      req.write(postData);
                      req.end();
                    } catch (error) {
                      console.log(error);
                    }
                  }
                }
                
              }
            }
            return res.status(204).json({})
            } catch (err) {
              next(err, req, res)
            }
          })

         /**
         * @openapi
         * /parking/{plate}:
         *   patch:
         *     summary: Patch a parking reservation.
         *     description: |
         *       Patches a license plate.
         *     parameters:
         *       - name: plate
         *         in: path
         *         required: true
         *         description: License plate number.
         *         schema:
         *           type: string
         *     responses:
         *       '204':
         *         description: No content.
         *       '404':
         *         description: Not found.
         *       '500':
         *         description: Internal server error.
         */
         app.patch('/api/parking/:plate', async function (req, res, next) {
          try {
            const { plate } = req.params
            let connection = await mysql.createConnection(db, {
              host: 'localhost',
              user: 'root',
              password: 'root',
              database: 'mydb',
              ssl: sslOptions
            })
            //if someone is leaving parking
            const message = await connection.execute('UPDATE `parking` SET `plate` = ? WHERE `plate` = ?', ['', plate])
            console.log(message);
            return res.status(204).json({})
          } catch (err) {
            next(err, req, res)
          }
        })

        /**
         * @openapi
         * /parking/{plate}:
         *   delete:
         *     summary: Remove a parking reservation.
         *     description: |
         *       Removes a parking reservation for the given license plate.
         *     parameters:
         *       - name: plate
         *         in: path
         *         required: true
         *         description: License plate number.
         *         schema:
         *           type: string
         *     responses:
         *       '204':
         *         description: No content.
         *       '404':
         *         description: Not found.
         *       '500':
         *         description: Internal server error.
         */
          app.delete('/api/parking/:plate', async function (req, res, next) {
            try {
              const { plate } = req.params
              let connection = await mysql.createConnection(db, {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'mydb',
                ssl: sslOptions
              })
              //if someone is leaving parking
              const message = await connection.execute('DELETE FROM `parking` WHERE `plate` = ?', [plate])
              console.log(message);
              return res.status(204).json({})
            } catch (err) {
              next(err, req, res)
            }
          })

          /**
           * @openapi
           * /spot:
           *   post:
           *     summary: Add a new parking spot
           *     description: Add a new spot to the system
           *     requestBody:
           *       required: true
           *       content:
           *         application/json:
           *           schema:
           *             type: object
           *             properties:
           *               number:
           *                  type: string
           *                  description: Parking number
           *               area:
           *                  type: string
           *                  description: Parking area
           *               disabled:
           *                  type: integer
           *                  description: Whether the spot is disabled (0 for no, 1 for yes)
           *     responses:
           *       200:
           *         description: The newly added spot
           *         content:
           *           application/json:
           *             schema:
           *               type: object
           *               properties:
           *                 affectedRows:
           *                   type: integer
           *                   description: The number of affected rows
           *                 insertId:
           *                   type: integer
           *                   description: The ID of the newly inserted spot
           */
          app.post('/api/spot', async function (req, res, next) {
            try {
              const { number, area, disabled } = req.body
              const sql = 'INSERT INTO parking (number, area, is_disabled) VALUES (?,?,?)'
              const connection = await mysql.createConnection(db, {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'mydb',
                ssl: sslOptions
              })
              const [rows, fields] = await connection.execute(sql, [number, area, disabled])
              return res.json(rows)
            } catch (err) {
              next(err, req, res)
            }
        })

          /**
           * @openapi
           * /parking:
           *   get:
           *     summary: Get a list of parking spots
           *     description: Returns a list of parking spots with their respective numbers, areas, and license plate numbers.
           *     parameters:
           *       - in: query
           *         name: page
           *         schema:
           *           type: integer
           *           default: 1
           *         description: Page number for pagination.
           *     responses:
           *       '200':
           *         description: A list of parking spots.
           *         content:
           *           application/json:
           *             schema:
           *               type: object
           *               properties:
           *                 parking:
           *                   type: array
           *                   items:
           *                     type: object
           *                     properties:
           *                       number:
           *                         type: string
           *                         description: Parking number
           *                       area:
           *                         type: string
           *                         description: Area for parking
           *                       disabled:
           *                         type: integer
           *                         description: Whether the spot is for disabled (0 for no, 1 for yes)
           *                       plate:
           *                         type: string
           *                   description: A list of parking spots.
           *                 page:
           *                   type: integer
           *                   description: The current page number.
           *       '500':
           *          description: Internal server error
           */
          app.get('/api/parking', async function (req, res, next) {
            try {
              const page = req.query.page ?? 1
              const offset = getOffset(page, listPerPage)
              const connection = await mysql.createConnection(db, {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'mydb',
                ssl: sslOptions
              })
              const [rows, fields] = await connection.query("SELECT number, area, is_disabled, plate FROM `parking` LIMIT ?,?", [ offset, 9])
              return res.json({"parking":rows, page})
            } catch (err) {
              next(err, req, res)
            }
          })

          /**
           * @openapi
           * /users:
           *   post:
           *     summary: Add a new user
           *     description: Add a new user to the system
           *     requestBody:
           *       required: true
           *       content:
           *         application/json:
           *           schema:
           *             type: object
           *             properties:
           *               first_name:
           *                  type: string
           *                  description: First name of the user
           *               last_name:
           *                  type: string
           *                  description: Last name of the user
           *               until:
           *                  type: string
           *                  description: Expiration date of the user's account
           *                  format: date
           *               disabled:
           *                  type: integer
           *                  description: Whether the user is disabled (0 for no, 1 for yes)
           *               license_1:
           *                  type: string
           *                  description: First driver's license number
           *               license_2:
           *                  type: string
           *                  description: Second driver's license number
           *               days:
           *                  type: object
           *                  description: Days of the week when the user is allowed to park
           *                  properties:
           *                     Monday:
           *                       type: string
           *                       description: Parking permission in area for Monday
           *                     Tuesday:
           *                       type: string
           *                       description: Parking permission in area for Tuesday
           *                     Wednesday:
           *                       type: string
           *                       description: Parking permission in area for Wednesday
           *                     Thursday:
           *                       type: string
           *                       description: Parking permission in area for Thursday
           *                     Friday:
           *                       type: string
           *                       description: Parking permission in area for Friday
           *                     Saturday:
           *                        type: string
           *                        description: Parking permission in area for Saturday
           *                     Sunday:
           *                        type: string
           *                        description: Parking permission in area for Sunday
           *     responses:
           *       200:
           *         description: The newly added user
           *         content:
           *           application/json:
           *             schema:
           *               type: object
           *               properties:
           *                 affectedRows:
           *                   type: integer
           *                   description: The number of affected rows
           *                 insertId:
           *                   type: integer
           *                   description: The ID of the newly inserted user
           */
          app.post('/api/users', async function (req, res, next) {
              try {
                const {first_name, last_name, license_1, license_2, disabled, days, until } = req.body
                for (let i = 0; i < license_1.length; i++) {
                     if ((i == 2 && license_1[i] === "O") || (i == 3 && license_1[i] === "O") || (i == 4 && license_1[i] === "O")){
                        license_1[i] = "0"
                     }
                     if ((i == 0 && license_1[i] === "0") || (i == 1 && license_1[i] === "0") || (i == 5 && license_1[i] === "0") || (i == 6 && license_1[i] === "0")){
                      license_1[i] = "O"
                   }
                }
                for (let i = 0; i < license_2.length; i++) {
                    if ((i == 2 && license_2[i] === "O") || (i == 3 && license_2[i] === "O") || (i == 4 && license_2[i] === "O")){
                      license_2[i] = "0"
                    }
                    if ((i == 0 && license_2[i] === "0") || (i == 1 && license_2[i] === "0") || (i == 5 && license_2[i] === "0") || (i == 6 && license_2[i] === "0")){
                    license_2[i] = "O"
                  }
                }
                let license_2_mod = "NULL"
                if(license_2.length !== 0) {
                  license_2_mod = license_2
                }
                const sql = 'INSERT INTO users (first_name, last_name, license_1, license_2, is_disabled, _days, until) VALUES (?,?,?,?,?,?,?)'
                const connection = await mysql.createConnection(db, {
                  host: 'localhost',
                  user: 'root',
                  password: 'root',
                  database: 'mydb',
                  ssl: sslOptions
                })
                const [rows, fields] = await connection.execute(sql, [first_name, last_name, license_1, license_2_mod, disabled, days, until])
                return res.json(rows)
              } catch (err) {
                next(err, req, res)
              }
          })

          /**
           * @openapi
           * /user/{id}:
           *   put:
           *     summary: Update a user by ID
           *     description: Update a user using their ID
           *     parameters:
           *       - in: path
           *         name: id
           *         required: true
           *         description: ID of the user to update
           *         schema:
           *           type: integer
           *     requestBody:
           *       description: User object to update
           *       required: true
           *       content:
           *         application/json:
           *           schema:
           *             type: object
           *             properties:
           *               first_name:
           *                 type: string
           *                 description: First name of the user
           *               last_name:
           *                 type: string
           *                 description: Last name of the user
           *               until:
           *                 type: string
           *                 description: Expiration date of the user's account
           *                 format: date
           *               disabled:
           *                 type: integer
           *                 description: Whether the user is disabled (0 for no, 1 for yes)
           *               license_1:
           *                 type: string
           *                 description: First driver's license number
           *               license_2:
           *                 type: string
           *                 description: Second driver's license number
           *               days:
           *                 type: object
           *                 description: Days of the week when the user is allowed to park
           *                 properties:
           *                   Monday:
           *                     type: string
           *                     description: Parking permission in area for Monday
           *                   Tuesday:
           *                     type: string
           *                     description: Parking permission in area for Tuesday
           *                   Wednesday:
           *                     type: string
           *                     description: Parking permission in area for Wednesday
           *                   Thursday:
           *                     type: string
           *                     description: Parking permission in area for Thursday
           *                   Friday:
           *                     type: string
           *                     description: Parking permission in area for Friday
           *                   Saturday:
           *                     type: string
           *                     description: Parking permission in area for Saturday
           *                   Sunday:
           *                     type: string
           *                     description: Parking permission in area for Sunday
           *     responses:
           *       '200':
           *         description: User updated successfully
           *         content:
           *           application/json:
           *             schema:
           *               type: object
           *               properties:
           *                 id:
           *                   type: integer
           *                   description: User ID
           *                 first_name:
           *                   type: string
           *                   description: First name of the user
           *                 last_name:
           *                   type: string
           *                   description: Last name of the user
           *                 until:
           *                   type: string
           *                   description: Expiration date of the user's account
           *                   format: date
           *                 disabled:
           *                   type: integer
           *                   description: Whether the user is disabled (0 for no, 1 for yes)
           *                 license_1:
           *                   type: string
           *                   description: First driver's license number
           *                 license_2:
           *                   type: string
           *                   description: Second driver's license number
           *                 days:
           *                   type: object
           *                   description: Days of the week when the user is allowed to park
           *                   properties:
           *                     Monday:
           *                       type: string
           *                       description: Parking permission in area for Monday
           *                     Tuesday:
           *                       type: string
           *                       description: Parking permission in area for Tuesday
           *                     Wednesday:
           *                       type: string
           *                       description: Parking permission in area for Wednesday
           *                     Thursday:
           *                       type: string
           *                       description: Parking permission in area for Thursday
           *                     Friday:
           *                       type: string
           *                       description: Parking permission in area for Friday
           *                     Saturday:
           *                       type: string
           *                       description: Parking permission in area for Saturday
           *                     Sunday:
           *                       type: string
           *                       description: Parking permission in area for Sunday
           *       '400':
           *         description: Bad request
           *       '404':
           *         description: User not found
           *       '500':
           *         description: Internal server error
           */
          app.put('/api/user/:id', async function (req, res, next) {
            try {
              const {id} = req.params
              const {first_name, last_name, license_1, license_2, disabled, days, until } = req.body
              const sql = 'UPDATE users SET `first_name` = ?, `last_name` = ?, `license_1` = ?, `license_2` = ?, `is_disabled` = ?, `_days` = ?, `until` = ? WHERE `id` = ?'

              const connection = await mysql.createConnection(db, {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'mydb',
                ssl: sslOptions
              })
              let license_2_mod = "NULL"
              if(license_2.length !== 0) {
                license_2_mod = license_2
              }
              const [rows, fields] = await connection.execute(sql, [first_name, last_name, license_1, license_2_mod, disabled, days, until, id])
              return res.json(rows[0])
            } catch (err) {
              next(err, req, res)
            }
          })

          /**
           * @openapi
           * /user/{id}:
           *   delete:
           *     summary: Delete a user by ID
           *     description: Deletes a user from the database by ID
           *     parameters:
           *       - in: path
           *         name: id
           *         description: ID of the user to delete
           *         required: true
           *         schema:
           *           type: integer
           *     responses:
           *       200:
           *         description: OK
           *       500:
           *         description: Internal server error
           */
          app.delete('/api/user/:id', async function (req, res, next) {
            try {
              const {id} = req.params
              const sql = 'DELETE FROM `users` WHERE `id` = ?'
              const connection = await mysql.createConnection(db, {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'mydb',
                ssl: sslOptions
              })
              const [rows, fields] = await connection.execute(sql, [id])
              return res.json(rows[0])
            } catch (err) {
              next(err, req, res)
            }
          })

          /**
           * @openapi
           * /users:
           *   get:
           *     summary: Get a list of users.
           *     parameters:
           *       - in: query
           *         name: page
           *         schema:
           *           type: integer
           *         description: The page number to retrieve.
           *     responses:
           *       '200':
           *         description: A list of users.
           *         content:
           *           application/json:
           *             schema:
           *               type: object
           *               properties:
           *                 users:
           *                   type: array
           *                   items:
           *                     type: object
           *                     properties:
           *                       id:
           *                         type: integer
           *                         description: User ID
           *                       first_name:
           *                         type: string
           *                         description: First name of the user
           *                       last_name:
           *                         type: string
           *                         description: Last name of the user
           *                       until:
           *                         type: string
           *                         description: Expiration date of the user's account
           *                         format: date
           *                       disabled:
           *                         type: integer
           *                         description: Whether the user is disabled (0 for no, 1 for yes)
           *                       license_1:
           *                         type: string
           *                         description: First driver's license number
           *                       license_2:
           *                         type: string
           *                         description: Second driver's license number
           *                       days:
           *                         type: object
           *                         description: Days of the week when the user is allowed to park
           *                         properties:
           *                           Monday:
           *                             type: string
           *                             description: Parking permission in area for Monday
           *                           Tuesday:
           *                             type: string
           *                             description: Parking permission in area for Tuesday
           *                           Wednesday:
           *                             type: string
           *                             description: Parking permission in area for Wednesday
           *                           Thursday:
           *                             type: string
           *                             description: Parking permission in area for Thursday
           *                           Friday:
           *                             type: string
           *                             description: Parking permission in area for Friday
           *                           Saturday:
           *                             type: string
           *                             description: Parking permission in area for Saturday
           *                           Sunday:
           *                             type: string
           *                             description: Parking permission in area for Sunday
           *                 page:
           *                   type: integer
           */
          app.get('/api/users', async function (req, res, next) {
            try {
              const page = req.query.page ?? 1
              const offset = getOffset(page, listPerPage)
              const connection = await mysql.createConnection(db, {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'mydb',
                ssl: sslOptions
              })
              let sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` LIMIT ?,?"
              let [rows, fields] = await connection.query(sql, [offset, listPerPage])
              return res.json({"users":rows, page})
            } catch (err) {
              next(err, req, res)
            }
          })

          /**
           * @openapi
           * /users/total:
           *   get:
           *     summary: Get the total number of users.
           *     description: Returns the total number of users.
           *     responses:
           *       200:
           *         description: The total number of users.
           *         content:
           *           application/json:
           *             schema:
           *               type: object
           *               properties:
           *                 total:
           *                   type: integer
           *                   description: The total number of users.
           */
          app.get('/api/users/total', async function (req, res, next) {
            try {
              const connection = await mysql.createConnection(db, {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'mydb',
                ssl: sslOptions
              })
              let sql = "SELECT COUNT(users.id) AS total FROM `users`"
              let [rows, fields] = await connection.query(sql, [])
              return res.json({"total": rows[0].total})
            } catch (err) {
              next(err, req, res)
            }
          })

          /**
           * @openapi
           * /user/{id}:
           *   get:
           *     summary: Get a user by ID.
           *     description: Returns the user with the specified ID.
           *     parameters:
           *       - in: path
           *         name: id
           *         schema:
           *           type: integer
           *         required: true
           *         description: The ID of the user to retrieve.
           *     responses:
           *       200:
           *         description: User details.
           *         content:
           *           application/json:
           *             schema:
           *             type: object
           *             properties:
           *               id:
           *                 type: integer
           *                 description: User ID
           *               first_name:
           *                 type: string
           *                 description: First name of the user
           *               last_name:
           *                 type: string
           *                 description: Last name of the user
           *               until:
           *                 type: string
           *                 description: Expiration date of the user's account
           *                 format: date
           *               disabled:
           *                 type: integer
           *                 description: Whether the user is disabled (0 for no, 1 for yes)
           *               license_1:
           *                 type: string
           *                 description: First driver's license number
           *               license_2:
           *                 type: string
           *                 description: Second driver's license number
           *               days:
           *                 type: object
           *                 description: Days of the week when the user is allowed to park
           *                 properties:
           *                   Monday:
           *                     type: string
           *                     description: Parking permission in area for Monday
           *                   Tuesday:
           *                     type: string
           *                     description: Parking permission in area for Tuesday
           *                   Wednesday:
           *                     type: string
           *                     description: Parking permission in area for Wednesday
           *                   Thursday:
           *                     type: string
           *                     description: Parking permission in area for Thursday
           *                   Friday:
           *                     type: string
           *                     description: Parking permission in area for Friday
           *                   Saturday:
           *                     type: string
           *                     description: Parking permission in area for Saturday
           *                   Sunday:
           *                     type: string
           *                     description: Parking permission in area for Sunday
           *       404:
           *         description: User not found.
           *       500:
           *         description: Internal server error.
           */
          app.get('/api/user/:id', async function (req, res, next) {
            try {
              const {id} = req.params
              const sql = 'SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `id` = ?'
              const connection = await mysql.createConnection(db, {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'mydb',
                ssl: sslOptions
              })
              const [rows, fields] = await connection.execute(sql, [id])
              if(rows.length > 0){
                return res.json(rows[0])
              }else{
                return res.status(404).json({})
              }
            } catch (err) {
              next(err, req, res)
            }
          })

          /**
           * @openapi
           * /user/license/{license}:
           *   get:
           *     summary: Get user information by license number
           *     parameters:
           *       - in: path
           *         name: license
           *         description: License number of the user
           *         required: true
           *         schema:
           *           type: string
           *     responses:
           *       '200':
           *         description: User information retrieved successfully
           *         content:
           *           application/json:
           *             schema:
           *             type: object
           *             properties:
           *               id:
           *                 type: integer
           *                 description: User ID
           *               first_name:
           *                 type: string
           *                 description: First name of the user
           *               last_name:
           *                 type: string
           *                 description: Last name of the user
           *               until:
           *                 type: string
           *                 description: Expiration date of the user's account
           *                 format: date
           *               disabled:
           *                 type: integer
           *                 description: Whether the user is disabled (0 for no, 1 for yes)
           *               license_1:
           *                 type: string
           *                 description: First driver's license number
           *               license_2:
           *                 type: string
           *                 description: Second driver's license number
           *               days:
           *                 type: object
           *                 description: Days of the week when the user is allowed to park
           *                 properties:
           *                   Monday:
           *                     type: string
           *                     description: Parking permission in area for Monday
           *                   Tuesday:
           *                     type: string
           *                     description: Parking permission in area for Tuesday
           *                   Wednesday:
           *                     type: string
           *                     description: Parking permission in area for Wednesday
           *                   Thursday:
           *                     type: string
           *                     description: Parking permission in area for Thursday
           *                   Friday:
           *                     type: string
           *                     description: Parking permission in area for Friday
           *                   Saturday:
           *                     type: string
           *                     description: Parking permission in area for Saturday
           *                   Sunday:
           *                     type: string
           *                     description: Parking permission in area for Sunday
           *       '404':
           *         description: User not found
           */
          app.get('/api/user/license/:license', async function (req, res, next) {
            let {license} = req.params
            license = license.toUpperCase()
            const connection = await mysql.createConnection(db, {
              host: 'localhost',
              user: 'root',
              password: 'root',
              database: 'mydb',
              ssl: sslOptions
            })
            let [rows, fields] = await connection.query("SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `license_1` = ? OR `license_2` = ?", [license, license])
            if(rows.length > 0){
              return res.json(rows[0])
            }else{
              return res.status(404).json({})
            }
          })

          /**
           * @openapi
           * /users/first_name/{first_name}:
           *   get:
           *     summary: Get a list of users by first name
           *     parameters:
           *       - in: path
           *         name: first_name
           *         required: true
           *         description: First name of the user
           *         schema:
           *           type: string
           *       - in: query
           *         name: page
           *         required: false
           *         description: Page number to retrieve
           *         schema:
           *           type: integer
           *     responses:
           *       200:
           *         description: OK
           *         content:
           *           application/json:
           *             schema:
           *               type: object
           *               properties:
           *                 users:
           *                   type: array
           *                   items:
           *                     type: object
           *                     properties:
           *                       id:
           *                         type: integer
           *                         description: User ID
           *                       first_name:
           *                         type: string
           *                         description: First name of the user
           *                       last_name:
           *                         type: string
           *                         description: Last name of the user
           *                       until:
           *                         type: string
           *                         description: Expiration date of the user's account
           *                         format: date
           *                       disabled:
           *                         type: integer
           *                         description: Whether the user is disabled (0 for no, 1 for yes)
           *                       license_1:
           *                         type: string
           *                         description: First driver's license number
           *                       license_2:
           *                         type: string
           *                         description: Second driver's license number
           *                       days:
           *                         type: object
           *                         description: Days of the week when the user is allowed to park
           *                         properties:
           *                           Monday:
           *                             type: string
           *                             description: Parking permission in area for Monday
           *                           Tuesday:
           *                             type: string
           *                             description: Parking permission in area for Tuesday
           *                           Wednesday:
           *                             type: string
           *                             description: Parking permission in area for Wednesday
           *                           Thursday:
           *                             type: string
           *                             description: Parking permission in area for Thursday
           *                           Friday:
           *                             type: string
           *                             description: Parking permission in area for Friday
           *                           Saturday:
           *                             type: string
           *                             description: Parking permission in area for Saturday
           *                           Sunday:
           *                             type: string
           *                             description: Parking permission in area for Sunday
           *                 page:
           *                   type: integer
           *                   description: Page number of the response
           */
          app.get('/api/users/first_name/:first_name', async function (req, res, next) {
            try {
              const page = req.query.page ?? 1
              const offset = getOffset(page, listPerPage)
              const {first_name} = req.params

              const sql = 'SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `first_name` LIKE ? LIMIT ?,?'

              const connection = await mysql.createConnection(db, {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'mydb',
                ssl: sslOptions
              })
              const [rows, fields] = await connection.query(sql, [first_name + "%", offset, listPerPage])
              return res.json({"users": rows, page})
            } catch (err) {
              next(err, req, res)
            }
          })

          /**
           * @openapi
           * /users/first_name/total/{first_name}:
           *   get:
           *     summary: Get the total count of users by first name
           *     parameters:
           *       - in: path
           *         name: first_name
           *         description: First name of the user(s)
           *         required: true
           *         schema:
           *           type: string
           *     responses:
           *       '200':
           *         description: Total count of users retrieved successfully
           *         content:
           *           application/json:
           *             schema:
           *               type: object
           *               properties:
           *                 total:
           *                   type: integer
           *                   description: Total count of users matching the first name provided
           *       '500':
           *         description: Internal server error
           */
          app.get('/api/users/first_name/total/:first_name', async function (req, res, next) {
            try {
              const {first_name} = req.params
              const sql = 'SELECT COUNT(users.id) AS total FROM `users` WHERE `first_name` LIKE ?'
              const connection = await mysql.createConnection(db, {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'mydb',
                ssl: sslOptions
              })
              let [rows, fields] = await connection.query(sql, [first_name + "%"])
              return res.json({"total": rows[0].total})
            } catch (err) {
              next(err, req, res)
            }
          })

          /**
           * @openapi
           * /users/last_name/{last_name}:
           *   get:
           *     summary: Get a list of users by last name
           *     parameters:
           *       - in: path
           *         name: last_name
           *         required: true
           *         description: Last name of the user
           *         schema:
           *           type: string
           *       - in: query
           *         name: page
           *         required: false
           *         description: Page number to retrieve
           *         schema:
           *           type: integer
           *     responses:
           *       200:
           *         description: OK
           *         content:
           *           application/json:
           *             schema:
           *               type: object
           *               properties:
           *                 users:
           *                   type: array
           *                   items:
           *                     type: object
           *                     properties:
           *                       id:
           *                         type: integer
           *                         description: User ID
           *                       first_name:
           *                         type: string
           *                         description: First name of the user
           *                       last_name:
           *                         type: string
           *                         description: Last name of the user
           *                       until:
           *                         type: string
           *                         description: Expiration date of the user's account
           *                         format: date
           *                       disabled:
           *                         type: integer
           *                         description: Whether the user is disabled (0 for no, 1 for yes)
           *                       license_1:
           *                         type: string
           *                         description: First driver's license number
           *                       license_2:
           *                         type: string
           *                         description: Second driver's license number
           *                       days:
           *                         type: object
           *                         description: Days of the week when the user is allowed to park
           *                         properties:
           *                           Monday:
           *                             type: string
           *                             description: Parking permission in area for Monday
           *                           Tuesday:
           *                             type: string
           *                             description: Parking permission in area for Tuesday
           *                           Wednesday:
           *                             type: string
           *                             description: Parking permission in area for Wednesday
           *                           Thursday:
           *                             type: string
           *                             description: Parking permission in area for Thursday
           *                           Friday:
           *                             type: string
           *                             description: Parking permission in area for Friday
           *                           Saturday:
           *                             type: string
           *                             description: Parking permission in area for Saturday
           *                           Sunday:
           *                             type: string
           *                             description: Parking permission in area for Sunday
           *                 page:
           *                   type: integer
           *                   description: Page number of the response
           */
          app.get('/api/users/last_name/:last_name', async function (req, res, next) {
            try {
              const page = req.query.page ?? 1
              const offset = getOffset(page, listPerPage)
              const {last_name} = req.params
              let sql = "SELECT id, first_name, last_name, until, is_disabled, license_1, license_2, _days FROM `users` WHERE `last_name` LIKE ? LIMIT ?,?"
              const connection = await mysql.createConnection(db, {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'mydb',
                ssl: sslOptions
              })
              let [rows, fields] = await connection.query(sql, [last_name + "%", offset, listPerPage])
              return res.json({"users":rows, page})
            } catch (err) {
              next(err, req, res)
            }
          })

          /**
           * @openapi
           * /users/last_name/total/{last_name}:
           *   get:
           *     summary: Get the total number of users with a certain last name.
           *     parameters:
           *       - in: path
           *         name: last_name
           *         schema:
           *           type: string
           *         required: true
           *         description: The last name to search for.
           *     responses:
           *       200:
           *         description: The total number of users with the given last name.
           *         content:
           *           application/json:
           *             schema:
           *               type: object
           *               properties:
           *                 total:
           *                   type: integer
           *                   example: 42
           */
          app.get('/api/users/last_name/total/:last_name', async function (req, res, next) {
            try {
              const {last_name} = req.params
              const sql = 'SELECT COUNT(users.id) AS total FROM `users` WHERE `last_name` LIKE ?'
              const connection = await mysql.createConnection(db, {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'mydb',
                ssl: sslOptions
              })
              let [rows, fields] = await connection.query(sql, [last_name + "%"])
              return res.json({"total": rows[0].total})
            } catch (err) {
              next(err, req, res)
            }
          })


          app.use((err, req, res, next) => {
            const statusCode = err.statusCode || 500;
            console.error(err.message, err.stack);
            //for debugging
            //return res.status(statusCode).json({ message: err.message });
            return res.status(statusCode).json({});
          })

          app.listen(3300)