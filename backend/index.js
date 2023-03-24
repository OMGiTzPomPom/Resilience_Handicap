const express = require('express')
const app = express()

app.use(express.json());
 
app.post('/register', function (req, res) {
    console.log(req.body.name)
    res.end();
})

app.post('/login', function (req, res) {
  console.log(req.body.name)
  res.end();
})

app.get('/get-parking', function (req, res) {
  console.log(req.query.area)
  res.end();
})
  
app.listen(3000)