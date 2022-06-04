const path = require("path");
const http = require("http");
const express = require("express");
const socket = require("socket.io");


const app = express();
const server = http.createServer(app);
const io = socket(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 5000;




const users = [];

//join useer to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

//get cuurent user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

//user leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//to get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}





let mainUser = [];



io.on('connection', (socket) => {

  console.log('a user connected', socket.id);





  //the user arguement is passed from the fronend
  socket.on('joinroom', (user) => {

    console.log('user=====================', user)

    socket.join(user.room)




    const userData = { username: user.username, room: user.room };
    mainUser.push(userData);

    // socket.emit('msg',` welcome to ...`);//as soon as someone connects it will send this message(will send msg to a single client)

    //console.log('+++++++++',user)

    //socket.emit('roomUsers',username)



    // Convert map into 2D list:
    // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
    const arr = Array.from(socket.adapter.rooms);
    console.log('arr', arr)
    // Filter rooms whose name exist in set:
    // ==> [['room1', Set(2)], ['room2', Set(2)]]
    const filtered = arr.filter(room => !room[1].has(room[0]))
    // Return only the room name: 
    // ==> ['room1', 'room2']
    const res = filtered.map(i => i[0]);
    console.log(res);

    console.log('user with id ', socket.id, ' connected in room-', user.room);



    //for send the room and use details

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>', mainUser,mainUser.room)

    

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

   function getRoomUsers(room) {
      return mainUser.filter(user => user.room === room);
    }


  })



  socket.on('sendMessage', (data) => {
    //io.emit('message',{data})//to sent to all
    socket.to(data.room).emit('recieveMsg', data);//to send the data to only that specific room's users
    console.log(data)
  })

  socket.on('disconnect', ({ name, msg }) => {
    console.log('a user disconnected', socket.id);
  })








});


server.listen(port, () => console.log(`server is running at ${port}`));