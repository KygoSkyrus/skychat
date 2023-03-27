import React, { useState, useEffect,useRef, useReducer } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import hamburger from "./assets/menu.png";
import notification from "./assets/discord.mp3";

import { getFirestore, collection, query, where, doc,orderBy, getDocs, getDoc, addDoc, setDoc ,serverTimestamp,toDate, limit,} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";


const Chat = ({ socket, user, firebaseApp, allUser, me }) => {
  const [currentMsg, setcurrentMsg] = useState("");//typed text
  const [roomUsersList, setRoomUsersList] = useState([]);//room users list[will be used when room feature will be implemented]
  const [toChatWithSelected, setToChatWithSelected]=useState(false);
  const [toChatWithID, setToChatWithID]=useState();//has the id of the othe person who is selected to have chat with
  const [wlcmMsg, setwlcmMsg] = useState();//yet to implement [only for rooms]
  const dummy=useRef();

console.log('allUser',allUser,me)

  //fsp try----------------
  //have to check why its calling db one evry leter typed
  let dbQuery ;
  const firestore = getFirestore(firebaseApp);
  if(toChatWithID){
    //the reason why hen where is set to to is now returning any result bcz thers is order by and we havent indesx time with to,,,have to create a composite index ot time and to
    //dbQuery = query(collection(firestore, "v1"), where("to", "==", toChatWithID),orderBy("time","desc"), limit(20));//if you limit the record then they will give you the first few records..but we want records from below,,,so set the order to descending,,also set indexed in firebase
  }
  const [allMessages]=useCollectionData(dbQuery,{idField:'id'})
  allMessages?.reverse()//here reversed the returned msgs list array,,so that we have latest at first
  console.log('allmessages-----------',allMessages)
  //fsp try-------------



  const sendMsg = async () => {
    if (currentMsg !== "" && toChatWithID) {
      // const msgData = {
        //   room: user.room,
      //   author: user.username,
      //   message: currentMsg,
      //   time: serverTimestamp(),
      // };

      const msgData = {
        to: toChatWithID,
        from: me.userID,
        message: currentMsg,
        isPrivate : true,
        time: serverTimestamp(),
      };


      //sender client
      socket.emit("private message", {
          msgData,
          to: toChatWithID,
        });
        // this.selectedUser.messages.push({
        //   content,
        //   fromSelf: true,
        // });
  
      await socket.emit("sendMessage", msgData);
      readWriteDb(msgData);

      // const chatBox = document.querySelector(".chat-box");
      //chatBox.scrollTop = chatBox.scrollHeight+10;//to scroll to bottom

      setcurrentMsg(""); //clearing msg from input field
      dummy.current?.scrollIntoView({behaviour:'smooth'})//have to move it to right place bcz its not fulfilling it purpose correctly:when the db query on every input defect is fixed this might work fine,that is the root
    }
  };

  //for client recipient
  socket.on("private message", ({ content, from }) => {
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      if (user.userID === from) {
        user.messages.push({
          content,
          fromSelf: false,
        });
        if (user !== this.selectedUser) {
          user.hasNewMessages = true;
        }
        break;
      }
    }
  });


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
    //i dont things is necessary/remove it
    let body = document.getElementsByTagName("body")[0];

    body.addEventListener("click", function (e) {
      let sidebar = document.getElementById("mySidebar");

      if (true) {
        console.log(body, e.target);
        console.log("onload");
      }
    });
  };




  
  async function readWriteDb(msgObj){
    //to write data in db
    try {
      const docRef = await addDoc(collection(firestore, "v1"), msgObj);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  

  async function chatThisGuy(e){
    console.log('chatthis',e.target.dataset.uid,e.target.innerText)

    document.querySelectorAll('.closeButton')[0].click();//hiding sidebar when selected
    await setToChatWithSelected(true)//showimg the chat window
    document.getElementById('chatWith').innerHTML=e.target.innerText;//setting name of selectd person

    await setToChatWithID(e.target.dataset.uid)//setting the id of the other user//here we have to writ eth code to get ths chats witn this selected guy
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
          {allUser?.map(x=>{if(x.userID!==me.userID){
            return(<span data-uid={x.userID} className="w3-bar-item w3-button"onClick={e=>chatThisGuy(e)} >{x.username}</span>)}})}
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
                    me.userID === mesgContent.from
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
                     me.userID === mesgContent.from
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
