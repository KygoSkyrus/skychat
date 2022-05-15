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





io.on('connection', (socket) => {
  console.log('a user connected',socket.id);

  //the data arguement is passed from the fronend
  socket.on('joinroom', (data)=>{
    socket.join(data)
    console.log('user with id ',socket.id,' connected in room-',data);
  })

  socket.on('sendMessage', (data)=>{
    //io.emit('message',{data})
    socket.to(data.room).emit('recieveMsg',data);//to send the data to only that specific room's users
    console.log(data)
  })

  socket.on('disconnect', ({name,msg})=>{
    console.log('a user disconnected',socket.id);
  })




});
 

server.listen(port, () => console.log(`server is running at ${port}`));
