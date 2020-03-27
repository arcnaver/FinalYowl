/**
 * PROJECT: CS313 FINAL - YOWL
 * DESCRIPTION: A nodejs chat app that allows multiple users to connect.
 * 
 * FILE: server.js
 *  This is the entry point of the app
 * 
 * Author: Adam Tipton
 * Date: 3/12/2020
 * Version: 1
 */
require('dotenv').config();
var express = require('express');
const socketIO = require('socket.io');
const INDEX = 'public/index.html';
const path = require('path');
const { Pool } = require('pg');
//const favicon = require('serve-favicon');

//DATABASE URL
const connectionString = process.env.DATABASE_URL;

//Session
const session = require('express-session');
var sess;
//var FileStore = require('session-file-store')(session);

//Hash
const bcrypt = require('bcrypt'); //Works great

//Important Variables
var PORT = process.env.PORT || 5000;
const pool = new Pool({ connectionString: connectionString});

const server = express()
  .use(express.static(path.join(__dirname, 'public')))
  //.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  //favicon
  //.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
  //Use session storage
  .use(session({
    //store: new FileStore(),
    secret: 'somethingsecure',
    resave: true,
    saveUninitialized: true
  }))

  .get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
  })

  //favicon
  //.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

  //homepage
  .get("/home", function(req, res) {
      console.log("Recieved a request for the home page");
      
      res.render("home");
  })

  //User Signup route
  .post('/signUp', (req, res)=> {
      //Session
      sess = req.session;
      //var user_name = req.query.new_user_name;     
      //Sanitize 
      var user_name = req.query.new_user_name;
      user_name = typeof(user_name) == 'string' && user_name.trim().length > 0 ? user_name.trim() : '';
      var password = req.query.new_password;   
      password = typeof(password) == 'string' && password.trim().length > 0 ? password.trim() : '';     
      var first_name = req.query.first_name; 
      first_name = typeof(first_name) == 'string' && first_name.trim().length > 0 ? first_name.trim() : '';       
      var last_name = req.query.last_name;
      last_name = typeof(last_name) == 'string' && last_name.trim().length > 0 ? last_name.trim() : '';
      console.log("Inside signup");
      
      //hash the password
      //var hashed_password = bcrypt.hashSync(password, 10);

      //log it out
      console.log("user name: " + user_name);
      //console.log("password: " + hashed_password);
      console.log("First name: " + first_name);
      console.log("Last Name: " + last_name);
      bcrypt.hash(password, 10, function(err, hash) {
          console.log("hash is: " + hash);
          // Store hash in your password DB.
          //Insert new credentials string   
          var insert_cred = 'INSERT INTO yowl.login_prof_credentials(user_name, user_password, first_name, last_name) VALUES(' + '\'' + user_name + '\'' 
          + ',' + '\'' + hash + '\'' + ',' + '\'' + first_name + '\'' + ',' + '\'' + last_name + '\'' + ')';
         console.log('Getting ready to query db');
          //Query the db     
            pool.query(insert_cred, (err, result)=>{
              if(err){
                  return console.error(err);
              } else {              

                  //Save username in session
                  sess.username = user_name;
                  //We just want the user_name in this case to be passed back. 
                  console.log("Sending user_name back: " + user_name);
                  res.send(user_name);
                  
              }
          } )
      });
  })       

  //User Login route
  .post('/getLogin', (req, res)=>{
      //Session
      sess = req.session;
      //sanitize
      var user_name = req.query.user_name;
      user_name = typeof(user_name) == 'string' && user_name.trim().length > 0 ? user_name.trim() : '';
      
      var password = req.query.password;
      password = typeof(password) == 'string' && password.trim().length > 0 ? password.trim() : '';

      console.log("user name: " + user_name);
      console.log("password: " + password);
      userName: req.query.user_name;

      pool.query('SELECT user_name, user_password FROM yowl.login_prof_credentials WHERE user_name = ' + '\'' + user_name + '\'',(err, result)=>{
      //pool.query('SELECT user_name, user_password FROM yowl.login_prof_credentials WHERE user_name = :userName',(err, result)=>{
          //console.log(result.rows[0].user_name);
          
          //If it passes null back send nameerr
          if(result.rows[0] == null){
              console.log("NULL");
              res.send("nameerr")
          } else {
              //We made it with a valid user_name, now process it. 
              var passed_value = JSON.stringify(result.rows[0].user_name);
              user_name = '"' + user_name + '"';
              console.log("User name passed back: " + passed_value + " User_name should be: " + user_name);
              //We are comparing user names and passwords
              if(JSON.stringify(result.rows[0].user_name) == user_name){
                  console.log("Found it!");

                  //Hashed password from db                    
                  const hash = result.rows[0].user_password;
                  console.log("The hash is: " + hash);                               
                                  
                  var match = bcrypt.compareSync(password, hash);
                  if (match) {
                      console.log("They match");
                      
                      //Store username in session
                      sess.username = result.rows[0].user_name;
                     
                      console.log("Session Username is: " + sess.username);
                      //We just want the user_name in this case, which is all that should've been grabbed anyways. 
                      //res.json(result.rows[0].user_name);
                      res.send(sess.username);
                  } else {
                      res.send("pw");
                      console.log("They don't match fool!");
                  }

                  
              } 
          }                
          
      } )
  })   
    


  //.listen(PORT, () => console.log(`Listening on ${PORT}`));
//This is our port. It is the gatekeeper, allowing us to connect to the world and the world to us. 
.listen(PORT,()=> {
    console.log('Starten up, da shield!');
    console.log('Shield generator up on port ' + PORT + '. Listening!');
});

const io = socketIO(server);



io.on('connection', (socket) => {  
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);    
//   });  
io.on('connection', function(socket){
  socket.on('chat message', function(msg){   
    //Socket.io storage
    socket.username = sess.username;
    var name = msg.name;
    console.log("passed name: " + name);
    var msg = " " + msg.msg;
    var date = new Date();
    var hours = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var time = hours + ":" + min + ":" + sec;
    var out = {id: socket.username, message: msg, time: time};
    io.emit('chat message', out);
    
    //io.emit('chat message', out);
    console.log("Socket username is: " + socket.username)   
    console.log(out);
  }); 
  
});

// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

