import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import Chat from "./Chat";
//  "proxy": "http://localhost:5000",


const socket = socketIOClient('http://localhost:3000');

export const NewRTCA = () => {


  const [user, setuser] = useState({username:"",room:""})
  const [showchat, setshowchat] = useState(false);

  console.log(user)

  const joinRoom =()=>{
      if(user.username!==""&&user.room!==""){
        socket.emit('joinroom',user)//here we sending room as the second arguimenmt which will go the backend where the join room is declared
        setshowchat(true)
      }
  }

 


  return (
    <>
     {!showchat? (<div className='outer-join'>
        <h1 className="text-center">...</h1>

        <div className="d-flex flex-column ">
          <input type='text' name="username" onChange={e => setuser(user=>({...user,username:e.target.value}))} value={user.username} placeholder='username' />
          <input type='text' name="room" onChange={e => setuser(user=>({...user,room:e.target.value}))} value={user.room} placeholder='room' className="my-1"  />
          <button onClick={joinRoom} >JOIN</button>

        </div>

      </div>)
      :
      (
          <Chat socket={socket} user={user} />
      )}


    </>
  )
}
