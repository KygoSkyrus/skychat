import React, { useState, useEffect } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';

import hamburger from './assets/menu.png'
import notification from './assets/discord.mp3'

const Chat = ({ socket, user}) => {
  const [currentMsg, setcurrentMsg] = useState("");
  const [msgList, setmsgList] = useState([]);

  const [userlist,setuserlist] = useState([]);

  const [wlcmMsg, setwlcmMsg] = useState();

  const sendMsg = async () => {
    if (currentMsg !== "") {
      const msgData = {
        room: user.room,
        author: user.username,
        message: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("sendMessage", msgData);
      setmsgList((list) => [...list, msgData]); //for seeting the msg we send in our screen too,,without this the mesg will be not shown in our screen
      const chatBox=document.querySelector('.chat-box');
      chatBox.scrollTop=chatBox.scrollHeight;

      setcurrentMsg(""); //clearing msg from input field
    }
  };




  useEffect(() => {
    socket.on("recieveMsg", (data) => {
      console.log(data.author);
      setmsgList((list) => [...list, data]); //for adding the mesg in list(the list parameter is what whicxh have all the previous msgs and the the new msg whhich is 'data' will be added )
      const chatBox=document.querySelector('.chat-box');
      chatBox.scrollTop=chatBox.scrollHeight;
      const audio = new Audio(notification);
      audio.play();
    });
    
    
    //welcome msg
    socket.on('msg',msg=>{
      setwlcmMsg(msg);
    })

    socket.on('roomUsers',data=>{
      console.log('msg',data)
      data.users.map(y=> setuserlist((x)=>[...x,y.username]))
      
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
        </div>

        <div className="chat-head">
          <div className="hamburger" onClick={() => sidebarVisibility(true)}>
            <img src={hamburger} alt='.' />
          </div>
          <div>
          <section>room:{user.room}</section>
          <section>uname:{user.username}</section>
          </div>
        </div>

        <div className="chat-body">
          <div className="chat-box">
 {wlcmMsg?<p className="wlcmMsg">{wlcmMsg}</p>:null}

 {userlist?.map(x=> <p key={x}>{x}</p> )} 

            {msgList.map((mesgContent) => {
              //bcz u r using username to distinguish the two clients if both the username are same thgen it will not be able to  differnetiate
              return (
                <div
                  className={
                    user.username === mesgContent.author
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
