import React, { useState, useEffect, } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import hamburger from "./assets/menu.png";
import notification from "./assets/discord.mp3";

import { getFirestore, collection, query, where, doc,orderBy, getDocs, getDoc, addDoc, setDoc ,serverTimestamp} from "firebase/firestore";


const Chat = ({ socket, user, firebaseApp }) => {
  const [currentMsg, setcurrentMsg] = useState("");
  const [msgList, setmsgList] = useState([]);
  const [msgList2, setmsgList2] = useState([]);

  const [userlist, setuserlist] = useState([]);

  const [wlcmMsg, setwlcmMsg] = useState();
  

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
      setmsgList((list) => [...list, msgData]); //for setting the msg we send in our screen too,,without this the mesg will be not shown in our screen
      const chatBox = document.querySelector(".chat-box");
      chatBox.scrollTop = chatBox.scrollHeight;

      setcurrentMsg(""); //clearing msg from input field
    }
  };

  useEffect(() => {
    socket.on("recieveMsg", (data) => {
      console.log(data.author);
      setmsgList((list) => [...list, data]); //for adding the mesg in list(the list parameter is what whicxh have all the previous msgs and the the new msg whhich is 'data' will be added )
      const chatBox = document.querySelector(".chat-box");
      chatBox.scrollTop = chatBox.scrollHeight;
      const audio = new Audio(notification);
      audio.play();
    });

    //welcome msg
    socket.on("msg", (msg) => {
      setwlcmMsg(msg);
    });

    socket.on("roomUsers", (data) => {
      console.log("msg", data);
      data.users.map((y) => setuserlist((x) => [...x, y.username]));

      console.log("mru", userlist);
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
        console.log("onload");
      }
    });
  };


  
  async function readWriteDb(msgObj){
    const db1 = getFirestore(firebaseApp);

    //to write data in db
    try {
      const docRef = await addDoc(collection(db1, "new3"), {msgObj});
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }


    //to read data from db
    const querySnapshot = await getDocs(collection(db1, "new3"));

    // const citiesRef=(collection(db1, "new3"));
    // const q = query(citiesRef, orderBy("createdAt"));
    // const querySnapshot11 = await getDocs(q);

    // querySnapshot11.forEach((doc) => {
    //   console.log('"========================>>>>"',doc);
    // });


    querySnapshot.forEach((doc) => {
      //console.log('gg timeInSec',doc._document)
      

      let textData={
        author:doc._document.data.value.mapValue.fields.msgObj.mapValue.fields.author.stringValue,
        message:doc._document.data.value.mapValue.fields.msgObj.mapValue.fields.message.stringValue,
        room:doc._document.data.value.mapValue.fields.msgObj.mapValue.fields.room.stringValue,
        time:doc._document.data.value.mapValue.fields.msgObj.mapValue.fields.time.stringValue,
        timeInSec:doc._document.version.timestamp.seconds,
      }
      setmsgList2((list) => [...list, textData]);
      //console.log("doc+++++++++++++++++++===", textData);
    });

   
  }
  
  async function gg() {
    const db = getFirestore(firebaseApp);

    //to write data(working)
    const citiesRef = collection(db, "messages");
    await setDoc(doc(citiesRef, "SF"), {
      name: "San Francisco",
      state: "CA",
      country: "USA",
      capital: false,
      population: 860000,
      regions: ["west_coast", "norcal"],
    });

    //to write data in db
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        msg: "Ada1",
        author: "Lovelace1",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    //to read data (working/better)
    const docRef1 = doc(db, "messages", "SF");
    const docSnap1 = await getDoc(docRef1);
    if (docSnap1.exists()) {
      console.log("Document data:", docSnap1.data());
    }

    //to read data from db
    const querySnapshot = await getDocs(collection(db, "messages"));
    querySnapshot.forEach((doc) => {
      console.log("doc", doc);
      console.log(`${doc.id} => ${doc.data()}`);
    });

    
  }

  //time should be right forp other
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
            <img src={hamburger} alt="." />
          </div>
          <div>
            <section>room:{user.room}</section>
            <section>uname:{user.username}</section>
          </div>
        </div>

        <div className="chat-body">
          <div className="chat-box">
            {wlcmMsg ? <p className="wlcmMsg">{wlcmMsg}</p> : null}

            {userlist?.map((x) => (
              <p key={x}>{x+"."}</p>
            ))}

            {msgList2.map((mesgContent) => {
              //bcz u r using username to distinguish the two clients if both the username are same thgen it will not be able to  differnetiate
              return (
                <>
                <div
                  className={
                    user.username === mesgContent.author
                      ? "msg-block me"
                      : "msg-block other"
                  }
                  key={mesgContent.time}
                >
                  <section className="msg">{mesgContent.message}</section>

                  <span className="msg-date">{mesgContent.time}</span>

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
        </div>
      </div>
    </>
  );
};

export default Chat;
