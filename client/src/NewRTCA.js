import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import Chat from "./Chat";
//  "proxy": "http://localhost:5000",


const socket = socketIOClient('http://localhost:3000');

export const NewRTCA = () => {


  const [username, setusername] = useState('');
  const [room, setroom] = useState('');
  const [showchat, setshowchat] = useState(false);

  const joinRoom =()=>{
      if(username!==""&&room!==""){
        socket.emit('joinroom',room)//here we sending room as the second arguimenmt which will go the backend where the join room is declared
        setshowchat(true)
      }

  }




  return (
    <>
     {!showchat? (<div className='form'>
        <h1 className="text-center">...</h1>

        <div className="d-flex flex-column ">
          <input type='text' name="username" onChange={e => setusername(e.target.value)} value={username} placeholder='username' />
          <input type='text' name="room" onChange={e => setroom(e.target.value)} value={room} placeholder='room' className="my-1"  />
          <button onClick={joinRoom} >JOIN</button>


        </div>

      </div>)
:
      (<div className="bg-light p-3 m-3">
          <Chat socket={socket} room={room } username={username} />
      </div>)}


    </>
  )
}
