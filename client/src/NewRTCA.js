import React, { useState, } from "react";
// import socketIOClient from "socket.io-client";
import {io} from "socket.io-client";
import Chat from "./Chat";


export const NewRTCA = ({firebaseApp}) => {


  // const socket = socketIOClient('http://localhost:3000');
  const socket = io('http://localhost:3000',{ autoConnect: false });

   //So that any event received by the client will be printed in the console.
   socket.onAny((event, ...args) => {
    console.log('triggered event :- ',event, args);
  });



  const [user, setuser] = useState({username:"",room:""})
  const [letMeIn, setLetMeIn] = useState(false);
  

  //new states
  const [me,setMe]=useState()
  const [allUser,setAllUser]=useState()
  
  // console.log(user)

  const joinRoom =()=>{
      if(user.username!==""){
        //socket.emit('joinroom',user)//here we sending room as the second arguimenmt which will go the backend where the join room is declared
        setLetMeIn(true)
        let username=user.username
        socket.auth = {username} ;
        socket.connect(); 
      }
      dont('e')
  }

  socket.on("connect_error", (err) => {
    console.log('errmsg',err.message)
    if (err.message === "invalid username") {
      setLetMeIn(false);
      //create a varible whihc will keep the recprd if username is there or not for current user
    }
  });

  function dont(e){
    console.log('eee  dont')
  let cc=socket.emit("private", {
    msgData:"msgData",
    to: "toChatWithID",
  });
  console.log('cc',cc)
}
  
  socket.on("users", (users) => {
    users.forEach((user) => {
      user.self = user.userID === socket.id;
      setMe(user);
    });
    // put the current user first, and then sort by username
    users = users.sort((a, b) => {
      if (a.self) return -1;
      if (b.self) return 1;
      if (a.username < b.username) return -1;
      return a.username > b.username ? 1 : 0;
    });
    
     setAllUser(users);//[this is in case there are already joined before me]
    //console.log('usersssssssssssssssssssssss-',users)
    // console.log('uuuuuuuuu',u)
  });


  socket.on("user connected", (user,users) => {
   // console.log('new user',user)
    //console.log('--updated list',users)//list of all users
    setAllUser(users)//updating the userslist[this is in case for user joining after]
  });

  // socket.off("connect_error");
  return (
    <>
    <p style={{fontSize:"8px"}} onClick={e=>dont(e)}>here we will have a login page,,or maybe ther eis already,,from here the username will be take,,either from ggogle login or user create a accoundt,,,only the let user move forward..with that username the connection will be created in socket</p>
     {!letMeIn? (<div className='outer-join'>
        <h1 className="text-center">...</h1>

        <div className="d-flex flex-column ">
          <input type='text' name="username" onChange={e => setuser(user=>({...user,username:e.target.value}))} value={user.username} placeholder='username' />
          {/* <input type='text' name="room" onChange={e => setuser(user=>({...user,room:e.target.value}))} value={user.room} placeholder='room' className="my-1"  /> */}
          <button onClick={joinRoom} >JOIN</button>

        </div>

      </div>)
      :
      (
        <>
          <Chat socket={socket} user={user} firebaseApp={firebaseApp} allUser={allUser} me={me} />
        </>
      )}


    </>
  )
}
