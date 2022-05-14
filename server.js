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


  socket.on('message', ({name,msg})=>{
    io.emit('message',{name,msg})
  })

  socket.on('disconnect', ({name,msg})=>{
    console.log('a user disconnected',socket.id);
  })

});
 

server.listen(port, () => console.log(`server is running at ${port}`));
