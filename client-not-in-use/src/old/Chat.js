import React, { useState, useEffect } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';

import hamburger from './assets/menu.png'
import notification from './assets/discord.mp3'

const Chat = ({ socket, username, room }) => {
  const [currentMsg, setcurrentMsg] = useState("");
  const [msgList, setmsgList] = useState([]);

  const [userlist, setuserlist] = useState([]);

  const [wlcmMsg, setwlcmMsg] = useState();

  const [room, setroom] = useState('');
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit('joinroom', room)//here we sending room as the second arguimenmt which will go the backend where the join room is declared
      setshowchat(true)
    }

  }

  const sendMsg = async () => {
    if (currentMsg !== "") {
      const msgData = {
        room: room,
        author: username,
        message: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("sendMessage", msgData);
      //setuserlist((list)=>[...list,msgData.author])
      setmsgList((list) => [...list, msgData]); //for seeting the msg we send in our screen too,,without this the mesg will be not shown in our screen
      const chatBox=document.querySelector('.chat-box');
      chatBox.scrollTop=chatBox.scrollHeight;

      setcurrentMsg(""); //clearing msg from input field
    }
  };




  useEffect(() => {
    socket.on("recieveMsg", (data) => {
      console.log(data.author);
      //setuserlist((list)=>[...list,data.author])
      setmsgList((list) => [...list, data]); //for adding the mesg in list(the list parameter is what whicxh have all the previous msgs and the the new msg whhich is 'data' will be added )
      const chatBox=document.querySelector('.chat-box');
      chatBox.scrollTop=chatBox.scrollHeight;
      const audio = new Audio(notification);
      audio.play();
    });
    
    
    //welcome msg
    socket.on('msg',msg=>{
     // console.log('msg',msg)
      setwlcmMsg(msg);
    })

    socket.on('roomUsers',msg=>{
      console.log('msg',msg)
      //\setuserlist((list)=>[...list,msg])
      console.log('mru',userlist)
    })
    

  }, [socket]);

  const sidebarVisibility = (tf) => {
    let sidebar = document.getElementById("mySidebar");

    tf ? (sidebar.style.display = "block") : (sidebar.style.display = "none");
  };

  window.onload = function abc() {
    let body = document.getElementsByTagName("body")[0];

    body.addEventListener("click", function (e) {
      let sidebar = document.getElementById("mySidebar");

      if (true) {
        console.log(body, e.target);
        console.log('onload')
      }
    });
    
    
  };


  



  
  //time shouild be right forp other
  return (
    <>
      <div className="outer">
        <div
          className="w3-sidebar  w3-animate-left w3-bar-block w3-border-right"
          style={{ display: "none" }}
          id="mySidebar"
        >
          <div className="sidebar-head">
            <span>close</span>

            <span
              onClick={() => sidebarVisibility(false)}
              className="closeButton"
            >
              &times;
            </span>
          </div>

          <a href="abc.com" className="w3-bar-item w3-button">
           U
          </a>

          <a href="abc.com" className="w3-bar-item w3-button">
            Link 2
          </a>

          <a href="abc.com" className="w3-bar-item w3-button">
            Link 3
          </a>
          <input type='text' name="room" onChange={e => setroom(e.target.value)} value={room} placeholder='room' className="my-1" />
          <button onClick={joinRoom} >JOIN</button>
        </div>

        <div className="chat-head">
          <div className="hamburger" onClick={() => sidebarVisibility(true)}>
            <img src={hamburger} alt='.' />
          </div>
          <div>
          <section>room:{room}</section>
          <section>uname:{username}</section>
          </div>
        </div>

        <div className="chat-body">
          <div className="chat-box">
 {wlcmMsg?<p className="wlcmMsg">{wlcmMsg}</p>:null}

{/* {userlist?.map(x=><h2>{x}</h2>)} */}

            {msgList.map((mesgContent) => {
              //bcz u r using username to distinguis the two clients if both the username are same thgen it will not be able to  differnetiate
              return (
                <div
                  className={
                    username === mesgContent.author
                      ? "msg-block me"
                      : "msg-block other"
                  }
                  key={mesgContent.message}
                >
                  <section className="msg">{mesgContent.message}</section>

                  <span className="msg-date">{mesgContent.time}</span>

                  <section className="msg-arrow"></section>
                </div>
              );
            })}
           </div>

          
          <div className="msg-input form-control">
            <input
              type="text"
              name="msg"
              onChange={(e) => setcurrentMsg(e.target.value)}
              value={currentMsg}
              placeholder="type..."
              className="my-1"
              onKeyPress={(e) => e.key === "Enter" && sendMsg()}
              autoComplete='off'
            />

            <button onClick={sendMsg}>send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
