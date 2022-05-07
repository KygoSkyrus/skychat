const path = require("path");
const http = require("http");
const express = require("express");
const socket = require("socket.io");
//const formatMessage=require('./util/messages');
//const {userJoin, getCurrentUser, userLeave, getRoomUsers}=require('./util/users');

const app = express();
const server = http.createServer(app);
const io = socket(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 5000;



//run when client comnnects
// io.on("connection", (socket) => {
//   socket.on("joinroom", ({ username, room }) => {
//     const user = userJoin(socket.id, username, room);
//     socket.join(user.room);

//     //welcome current user
//     socket.emit(
//       "message",
//       formatMessage(botname, `${user.username}, welcome to SkyChat`)
//     ); //as soon as someone connects it will send this message(will send msg to a single client)

//     //broadcast when a useer connectrs(means send msg to everyone but the person himself)
//     socket.broadcast
//       .to(user.room)
//       .emit(
//         "message",
//         formatMessage(botname, `${user.username} has joined the chat`)
//       );

//     //send users and room info
//     io.to(user.room).emit("roomUsers", {
//       room: user.room,
//       users: getRoomUsers(user.room),
//     });
//   });

//   //listem for chatmessage
//   socket.on("chatmessage", (msg) => {
//     const user = getCurrentUser(socket.id);
//     io.to(user.room).emit("message", formatMessage(user.username, msg));
//   });

//   //runs when a client disconnects
//   socket.on("disconnect", () => {
//     const user = userLeave(socket.id);

//     if (user) {
//       io.to(user.room).emit(
//         "message",
//         formatMessage(botname, `${user.username}, has left the chat`)
//       );

//       //send users and room info
//       io.to(user.room).emit("roomUsers", {
//         room: user.room,
//         users: getRoomUsers(user.room),
//       });
//     }
//   });
// });



io.on('connection', (socket) => {
  console.log('a user connected');

  // socket.emit('connection', function(){
  //   console.log('emiotted')
  //   return {em:'emitted'}
  // });

  socket.on('message', ({name,msg})=>{
    io.emit('message',{name,msg})
  })

});
 
//  app.get("/", (req, res) => {
// //   console.log("url");
//  });

//"proxy": "http://localhost:5000",

server.listen(port, () => console.log(`server is running at ${port}`));
