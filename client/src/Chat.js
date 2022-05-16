import React, { useState, useEffect } from "react";

const Chat = ({ socket, username, room }) => {
  const [currentMsg, setcurrentMsg] = useState("");
  const [msgList, setmsgList] = useState([]);

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
      setmsgList((list) => [...list, msgData]); //for seeting the msg we send in our screen too,,without this the mesg will be not shown in our screen
      setcurrentMsg(""); //clearing msg from input field
    }
  };
  //add scrolltobittom in chat messages

  useEffect(() => {
    socket.on("recieveMsg", (data) => {
      console.log(data);
      setmsgList((list) => [...list, data]); //for adding the mesg in list(the list parameter is what whicxh have all the previous msgs and the the new msg whhich is 'data' will be added )
    });
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


  
  return (
    <>
      <div className="outer">
        <div
          className="w3-sidebar  w3-animate-left w3-bar-block w3-border-right"
          style={{ display: "none" }}
          id="mySidebar"
        >
          <div className="d-flex justify-content-between">
            <span>close</span>

            <button
              onClick={() => sidebarVisibility(false)}
              className="closeButton"
            >
              &times;
            </button>
          </div>

          <a href="abc.com" className="w3-bar-item w3-button">
            Link 1
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
            ☰
          </div>
        </div>

        <div className="chat-body">
          <div className="chat-box">
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
              placeholder="room"
              className="my-1"
              onKeyPress={(e) => e.key === "Enter" && sendMsg()}
            />

            <button onClick={sendMsg}>send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
