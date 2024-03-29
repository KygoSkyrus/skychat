const path = require("path");
const http = require("http");
const express = require("express");
const socket = require("socket.io");
const bodyParser = require('body-parser')


const app = express();
const server = http.createServer(app); 
const io = socket(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json())

const port = process.env.PORT || 5000;


// FIREBASE ADMIN 
const admin = require("firebase-admin");
// const { initializeApp } = require('firebase-admin/app');

const serviceAccount = require("./serviceAccountKey.js");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

app.post('/api/doesUserExist', (req, res) => {

  const { username } = req.body;
  console.log('user', username)

  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username);

  query.get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('User with username "test1" not found.');
        res.json({userFound: false, message:""})
      } else {
        const userDoc = snapshot.docs[0];
        console.log('User with username "test1" found:', userDoc.data());
        res.json({userFound: true, message:"Username already exists! Please try a different one."})
      }
    })
    .catch(error => {
      console.error('Error fetching user:', error);
      res.json({message:"Internal server error!"})
    });

})

// FIREBASE ADMIN 
// var admin = require("firebase-admin");
// var serviceAccount = require("path/to/serviceAccountKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://skyrus-3416b-default-rtdb.firebaseio.com"
// });
// Middleware to check user authentication
// const checkAuth = (req, res, next) => {
//   const idToken = req.headers.authorization;

//   admin
//     .auth()
//     .verifyIdToken(idToken)
//     .then((decodedToken) => {
//       req.user = decodedToken;
//       next();
//     })
//     .catch((error) => {
//       res.status(401).json({ error: 'Unauthorized' });
//     });
// };
// Example route that requires authentication
// app.get('/secure-route', checkAuth, (req, res) => {
//   res.json({ message: 'Authenticated User', user: req.user });
// });


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


io.use((socket, next) => {
  //thie below commented code was causing issue and now working as expected
  // const sessionID = socket.handshake.auth.sessionID;
  // console.log('usss', username,sessionID)
  // if (sessionID) {
  //   // find existing session
  //   const session = sessionStore.findSession(sessionID);
  //   if (session) {
  //     socket.sessionID = sessionID;
  //     socket.userID = session.userID;
  //     socket.username = session.username;
  //     return next();
  //   }
  // }
  // create new session
  // socket.sessionID = randomId();
  // socket.userID = randomId();
  console.log('socckte', socket)
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on('connection', (socket) => {

  console.log('a user connected', socket.id);

  //new TRYYYYYYYY------------------STARTS_____________________________


  // socket.join(socket.userID);


  //----------
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);//send all existing users to the client:
  //--------------

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  }, users);

  socket.on("private", ({ msgData, to }) => {
    console.log('pm', msgData, to)
    socket.to(to).emit("private", {
      msgData,
      from: socket.id,
    });
    //try for one to one connection
    // socket.to(to).to(socket.userID).emit("private", {
    //   msgData,
    //   from: socket.userID,
    //   to,
    // });
  });



  // socket.on("disconnect", async () => {
  //   const matchingSockets = await io.in(socket.userID).allSockets();
  //   const isDisconnected = matchingSockets.size === 0;
  //   if (isDisconnected) {
  //     // notify other users
  //     socket.broadcast.emit("user disconnected", socket.userID);
  //     // update the connection status of the session
  //     sessionStore.saveSession(socket.sessionID, {
  //       userID: socket.userID,
  //       username: socket.username,
  //       connected: false,
  //     });
  //   }
  // });


  //new TRYYYYYYYY------------------ENDS--__ __ _ __ __ _ _ __ _ __ _ __ _ ___ __ __ __

  //the user arguement is passed from the fronend
  socket.on('joinroom', (user) => {
    //to join a user to a room

    console.log('user=====================', user)

    socket.join(user.room)

    const userData = { username: user.username, room: user.room, uid: socket.id };
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
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>', mainUser, mainUser.room)

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

    function getRoomUsers(room) {
      return mainUser.filter(user => user.room === room);
    }

  })



  //when msg is sent
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