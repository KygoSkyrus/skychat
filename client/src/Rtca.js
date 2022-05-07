import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT="http://localhost:3000";
//  "proxy": "http://localhost:5000",
// const socket = socketIOClient(ENDPOINT);

export const Rtca = () => {

    const [response, setResponse] = useState({msg:'',name:''});
    const [chat, setchat] = useState([]);

    const socketRef=useRef();


    useEffect(() => { 
      //const socket = socketIOClient(ENDPOINT);
      // socket.on('connection', () => {
      //   console.log(`I'm connected with the back-end`);
      //   //socket.emit("initial_data");
      // });
      

      

      socketRef.current = socketIOClient.connect("http://localhost:3000");
			socketRef.current.on("message", ({ name, msg }) => {
				setchat([ ...chat, { name, msg } ])
			})
			return () => socketRef.current.disconnect()
      
    },[chat]);

    const onTextChange=(e)=>{
      setResponse({...response,[e.target.name]:e.target.value})
    }

    const msgSubmit=(e)=>{
       const {name,msg}=response;
      socketRef.current.emit('message',{name,msg})
      e.preventDefault();
      setResponse({msg:'',name})
    }


    const renderChat=()=>{
      return chat.map(({name,msg},index) => (
        <div key={index}>
          <h4> {name}:{msg}</h4>
        </div>
      ))
    }





   
  


  return (
      <>
    <form onSubmit={msgSubmit}>
      <h1>hey thre</h1>

        <input type='text' name="name" onChange={e=>onTextChange(e)} value={response.name} label='name' />
       
        <input type='text' name="msg" onChange={e=>onTextChange(e)} value={response.msg} label='msg' />

        <input type='submit' value='submit' />


    </form>
<div className="bg-light p-3 m-3">
{renderChat()}
</div>


  </>
  )
}
