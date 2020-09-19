const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const postRoutes = require('./routes/post')

dotenv.config()

mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true}, () => console.log('DB connected!'))


app.listen(8081, () => console.log('server is up now'))

// Routes

app.use(express.json())
app.use('/api/user', authRoute)
app.use('/api/posts', postRoutes)
// const port = process.env.PORT || 8081
// console.log('---------------------port', port)

// var routes = require('/routes/');
// routes(app); 
// app.listen(port,function(){
//     console.log('Server started on port: ' + port);
//     });