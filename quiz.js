const express = require('express')
const app = express()
const server = require('http').createServer(app)
const WebSocket = require('ws')
const mongoose = require("mongoose")
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
require("dotenv").config()
const User = require('./dbmodels/usermodel')
const loginroutes = require("./routes/loginRoutes.js")
const frontendroutes = require("./routes/frontendRoutes.js")

// Mongoose settings
mongoose.set("strictQuery", false)
mongoose.set('runValidators', true)

// Define the database URL to connect to.
const mongoDB = process.env.DB

// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err))
async function main() {
  if (await mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })) {
    console.log('DB connected!')
  }
}

const wss = new WebSocket.Server({ server:server })

wss.on('connection', function connection(ws) {
  console.log('A new client Connected!')
  ws.send('Welcome New Client!')

  ws.on('message', function incoming(message) {
    jsonmessage = JSON.parse(message)
    console.log(new Date)
    console.log(jsonmessage.message)
    console.log("from")
    console.log(jsonmessage.name)

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
    
  })
})

app.use(cookieParser()) // read cookies (needed for auth)

app.use(bodyParser.urlencoded({ extended: true })) // get information from html forms
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: process.env.SESSION, // session secret
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}))

app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(express.json())

app.use("/", loginroutes)
app.use("/", frontendroutes)
app.use(express.static('static'));

server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))