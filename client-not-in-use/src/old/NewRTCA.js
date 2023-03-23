import React, { useState, } from "react";
import socketIOClient from "socket.io-client";
import Chat from "./Chat";
//  "proxy": "http://localhost:5000",


const socket = socketIOClient('http://localhost:3000');

export const NewRTCA = (props) => {

  const { n, handleLogout } = props;


  const [username, setusername] = useState('');
 
  const [showchat, setshowchat] = useState(false);

  




  return (
    <>
      {!showchat ? (<div className='form'>
        <h1 className="text-center">...</h1>

        <div className="d-flex flex-column w-50">
          <input type='text' name="username" onChange={e => setusername(e.target.value)} value={username} placeholder='username' />
          


        </div>

      </div>)
        :
        (
          <Chat socket={socket} room={room} username={n}  />
        )}


    </>
  )
}
