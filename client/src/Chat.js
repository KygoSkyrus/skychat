import React, { useState, useEffect,useRef, useReducer } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import hamburger from "./assets/menu.png";
import notification from "./assets/discord.mp3";

import { getFirestore, collection, query, where, doc,orderBy, getDocs, getDoc, addDoc, setDoc ,serverTimestamp,toDate, limit,} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";


const Chat = ({ socket, user, firebaseApp, allUser }) => {
  const [currentMsg, setcurrentMsg] = useState("");
  const [roomUsersList, setRoomUsersList] = useState([]);//room users list
  const [toChatWithSelected, setToChatWithSelected]=useState(false);
  const [wlcmMsg, setwlcmMsg] = useState();
  const dummy=useRef();

  const sendMsg = async () => {
    if (currentMsg !== "") {
      const msgData = {
        room: user.room,
        author: user.username,
        message: currentMsg,
        time: serverTimestamp(),
      };

      await socket.emit("sendMessage", msgData);
      readWriteDb(msgData);
      //setmsgList((list) => [...list, msgData]); //for setting the msg we send in our screen too,,without this the mesg will be not shown in our screen
      const chatBox = document.querySelector(".chat-box");
      //chatBox.scrollTop = chatBox.scrollHeight+10;

      setcurrentMsg(""); //clearing msg from input field
      dummy.current?.scrollIntoView({behaviour:'smooth'})//have to move it to right place bcz its not fulfilling it purpose correctly:when the db query on every input defect is fixed this might work fine,that is the root
    }
  };

  useEffect(() => {
    socket.on("recieveMsg", (data) => {
      //console.log(data.author);
      const chatBox = document.querySelector(".chat-box");
      chatBox.scrollTop = chatBox.scrollHeight;
      const audio = new Audio(notification);
      audio.play();
    });

    //welcome msg for new user///yet to implement
    socket.on("msg", (msg) => {
      setwlcmMsg(msg);
    });

    socket.on("roomUsers", (data) => {
      console.log("msg", data);
      // data.users.map((y) => setRoomUsersList((x) => [...x, y.username]));
      let arr=[]
      data.users.map((x) => {
         arr.push({username:x.username,uid:x.uid})
      });
      setRoomUsersList(arr)
    });
  }, []);//it had socket as the dependency earlier
  //console.log("mru", userlist);

  const sidebarVisibility = (tf) => {
    let sidebar = document.getElementById("mySidebar");

    tf ? (sidebar.style.display = "flex") : (sidebar.style.display = "none");
  };
  
  window.onload = function abc() {
    let body = document.getElementsByTagName("body")[0];

    body.addEventListener("click", function (e) {
      let sidebar = document.getElementById("mySidebar");

      if (true) {
        console.log(body, e.target);
        console.log("onload");
      }
    });
  };



//fireship try----------------
//have to check why its calling db one evry leter typed
const firestore = getFirestore(firebaseApp);
const dbQuery = query(collection(firestore, "v1"), where("room", "==", user.room),orderBy("time","asc"));
const [allMessages]=useCollectionData(dbQuery,{idField:'id'})
//console.log('firship-----------',allMessages)
//fireship try-------------

  
  async function readWriteDb(msgObj){
    //to write data in db
    try {
      const docRef = await addDoc(collection(firestore, "v1"), msgObj);
      //console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  

  async function chatThis(e){
    console.log('chatthis',e.target.dataset.uid,e.target.innerText)
    document.querySelectorAll('.closeButton')[0].click();//hiding sidebar when selected
    await setToChatWithSelected(true)//showimg the chat window
    document.getElementById('chatWith').innerHTML=e.target.innerText;//setting name of selectd person
  }

  return (
    <>
      <div className="outer">
        <div
          className="w3-sidebar  w3-animate-left w3-bar-block w3-border-right"
          style={{ display: "none" }}
          id="mySidebar"
        >
          <div>
          <div className="sidebar-head">
            <span>close</span>

            <span
              onClick={() => sidebarVisibility(false)}
              className="closeButton"
            >
              &times;
            </span>
          </div>

         <div>
          {allUser?.map(x=>{return(<span data-uid={x.userID} className="w3-bar-item w3-button"onClick={e=>chatThis(e)} >{x.username}</span>)})}
          </div>
          </div>
          <section className="myProfile">{user.username}</section>

        </div>

        <div className="chat-head">
          <div className="hamburger" onClick={() => sidebarVisibility(true)}>
            <img src={hamburger} alt="." />
          </div>
          {toChatWithSelected?
          (<div className="chatWithProfile">
            <section id="chatWith"></section>
          </div>):""
          }
        </div>

        { toChatWithSelected ?
        (<div className="chat-body">
          <div className="chat-box">
            {wlcmMsg ? <p className="wlcmMsg">{wlcmMsg}</p> : null}

            {/* //for setting room users name */}
            {roomUsersList?.map((x) => {
              return(<p key={x.uid}>{x.username}</p>)}
            )}

            {allMessages?.map((mesgContent) => {
              //the key problem is in here 
              return (
                <>
                <div
                  className={
                    user.username === mesgContent.author
                      ? "msg-block me"
                      : "msg-block other"
                  }
                  key={mesgContent.id}
                >
                  <section className="msg">{mesgContent.message}</section>

                  <span className="msg-date">{mesgContent.time?.toDate().getHours()+':'+mesgContent.time?.toDate().getMinutes()}</span>

                  <section className="msg-arrow"></section>
                </div>
                <section className={
                    user.username === mesgContent.author
                      ? "authorName me"
                      : "authorName other"
                  }>{mesgContent.author}</section>
                </>
              );
            })}
            <div ref={dummy}></div>
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
              autoComplete="off"
            />

            <button onClick={sendMsg}>send</button>
          </div>
        </div>)
        :
        <div className="noOneToChat">
          <section>Select someone to chat with or Join a room</section>
        </div>
        }
      </div>
    </>
  );
};

export default Chat;
