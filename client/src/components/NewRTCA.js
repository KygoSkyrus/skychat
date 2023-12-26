import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import ScrollToBottom from "react-scroll-to-bottom";
// import socketIOClient from "socket.io-client";
import { io } from "socket.io-client";


import hamburger from "./../assets/menu.png";
import notification from "./../assets/discord.mp3";
import MessageWrapper from "./MessageWrapper";
import { UPDATE_USER_INFO } from "../redux/actionTypes";
import { LogOut, X } from 'lucide-react';


import { getFirestore, collection, query, where, doc, orderBy, getDocs, getDoc, addDoc, setDoc, serverTimestamp, toDate, limit, } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, updateProfile } from "firebase/auth";



// const socket = socketIOClient('http://localhost:3000');
const socket = io('http://localhost:3000', { autoConnect: false });//getting this out of the compoments bvcz when it was in,,it used to create a new seocket on every rerender

//So that any event received by the client will be printed in the console.
socket.onAny((event, ...args) => {
  console.log('triggered event :- ', event, args);
});


export const NewRTCA = ({ firebaseApp }) => {

  const [user, setuser] = useState({ username: "", room: "" })
  const [letMeIn, setLetMeIn] = useState(false);
  //new states
  const [me, setMe] = useState()
  const [allUser, setAllUser] = useState()


  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user)
  console.log('currentUser', currentUser)


  const navigate = useNavigate()
  const auth = getAuth();


  useEffect(() => {
    // const currentUser = auth.currentUser;

    //send this function to utils as it might be called for on eor mor component
    auth.onAuthStateChanged((user) => {
      console.log('authstate changed NWRTC', user)

      //set user in redux
      if (user) {
        dispatch({ type: UPDATE_USER_INFO, payload: user })
      } else {
        dispatch({ type: UPDATE_USER_INFO, payload: null })
        navigate('/')
      }
    });
  }, [])


  //-------XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-----from chat.js file --------XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX------
  const [currentMsg, setcurrentMsg] = useState("");//typed text
  const [roomUsersList, setRoomUsersList] = useState([]);//room users list[will be used when room feature will be implemented]
  const [allUsersList,setAllUsersList]=useState()
  const [toChatWithSelected, setToChatWithSelected] = useState(false);
  const [toChatWithID, setToChatWithID] = useState();//has the id of the othe person who is selected to have chat with
  const [wlcmMsg, setwlcmMsg] = useState();//yet to implement [only for rooms]
  const dummy = useRef();


  const sessionID = localStorage.getItem("sessionID");
  console.log('sessionid', sessionID)

  //fsp try----------------
  //have to check why its calling db one evry leter typed
  let dbQuery;
  const firestore = getFirestore(firebaseApp);
  if (toChatWithID) {
    //the reason why hen where is set to to is now returning any result bcz thers is order by and we havent indesx time with to,,,have to create a composite index ot time and to
    dbQuery = query(collection(firestore, "v1"), where("to", "==", toChatWithID), orderBy("time", "desc"), limit(20));//if you limit the record then they will give you the first few records..but we want records from below,,,so set the order to descending,,also set indexed in firebase
  }
  const [allMessages] = useCollectionData(dbQuery, { idField: 'id' })
  allMessages?.reverse()//here reversed the returned msgs list array,,so that we have latest at first
  //console.log('allmessages-----------',allMessages)
  //fsp try-------------

  async function sendMsg() {
    let currentMessage = document.getElementById('theText')
    if (currentMessage.value !== "" && toChatWithID) {
      // const msgData = {
      //   room: user.room,
      //   author: user.username,
      //   message: currentMsg,
      //   time: serverTimestamp(),
      // };

      const msgData = {
        to: toChatWithID,
        from: me.userID,
        message: currentMessage.value,
        isPrivate: true,
        time: serverTimestamp(),
      };
      console.log('msgdata', msgData)
      console.log('tochatwithid', toChatWithID)
      //sender client

      // dont();
      let xx = await socket.emit("private", {
        msgData: msgData,
        to: toChatWithID,
      });
      console.log('xx', xx)
      // this.selectedUser.messages.push({
      //   content,
      //   fromSelf: true,
      // });

      readWriteDb(msgData);

      // const chatBox = document.querySelector(".chat-box");
      //chatBox.scrollTop = chatBox.scrollHeight+10;//to scroll to bottom

      currentMessage.value = ""; //clearing msg from input field
      dummy.current?.scrollIntoView({ behaviour: 'smooth' })//have to move it to right place bcz its not fulfilling it purpose correctly:when the db query on every input defect is fixed this might work fine,that is the root
    }
  };

  async function readWriteDb(msgObj) {
    //to write data in db
    try {
      const docRef = await addDoc(collection(firestore, "v1"), msgObj);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  //for client recipient
  socket.on("private", ({ msgData, from }) => {
    console.log('pm recepient', msgData, from)
    // i dont think we need this below code,as its only seeeting msgs in the list
    // for (let i = 0; i < this.users.length; i++) {
    //   const user = this.users[i];
    //   if (user.userID === from) {
    //     user.messages.push({
    //       content,
    //       fromSelf: false,
    //     });
    //     if (user !== this.selectedUser) {
    //       user.hasNewMessages = true;
    //     }
    //     break;
    //   }
    // }
  });

  //rolling back to previous commit
  // socket.on("connect", () => {
  //   this?.users.forEach((user) => {
  //     if (user.self) {
  //       user.connected = true;
  //     }
  //   });
  // });
  // socket.on("disconnect", () => {
  //   this?.users.forEach((user) => {
  //     if (user.self) {
  //       user.connected = false;
  //     }
  //   });
  // });

  //will try later
  // socket.on("session", ({ sessionID, userID }) => {
  //   console.log('...',sessionID,userID)
  //   // attach the session ID to the next reconnection attempts
  //   socket.auth = { sessionID };
  //   // store it in the localStorage
  //   localStorage.setItem("sessionID", sessionID);
  //   // save the ID of the user
  //   socket.userID = userID;
  // });

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
      let arr = []
      data.users.map((x) => {
        arr.push({ username: x.username, uid: x.uid })
      });
      //setRoomUsersList(arr)
    });


    //getting all users (have to mve it somewhere whwere eit wont run on every stsate chnages, as its calling db on every stsata chnages decreasing the reads per day... add in usememo, usecallback)
    getAllUsersList()



  }, []);//it had socket as the dependency earlier



  const sidebarVisibility = (tf) => {
    let sidebar = document.getElementById("mySidebar");
    tf ? (sidebar.style.display = "flex") : (sidebar.style.display = "none");
  };


  async function chatThisGuy(e) {
    console.log('chatthis', e.target.dataset.uid, e.target.innerText)

    document.querySelectorAll('.closeButton')[0].click();//hiding sidebar when selected
    await setToChatWithSelected(true)//showimg the chat window
    document.getElementById('chatWith').innerHTML = e.target.innerText;//setting name of selectd person

    await setToChatWithID(e.target.dataset.uid)//setting the id of the other user//here we have to writ eth code to get ths chats witn this selected guy
  }

  //-------XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-----from chat.js file--------XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX------


  const joinRoom = () => {
    console.log('before sesssionid', sessionID)
    if (sessionID) {
      console.log('sesssionid', sessionID)
      // this.usernameAlreadySelected = true;
      setLetMeIn(true)
      socket.auth = { sessionID };
      socket.connect();
    } else if (user.username !== "") {
      console.log('elsee', socket)
      socket.emit('joinroom', user)//here we sending room as the second arguimenmt which will go the backend where the join room is declared
      setLetMeIn(true)
      let username = user.username
      socket.auth = { username };
      socket.connect();
    }
  }

  socket.on("connect_error", (err) => {
    console.log('errmsg', err.message)
    if (err.message === "invalid username") {
      setLetMeIn(false);
      //create a varible whihc will keep the recprd if username is there or not for current user
    }
  });

  //   function dont(e){
  //     console.log('eee  dont')
  //   let cc=socket.emit("private", {
  //     msgData:"msgData",
  //     to: "toChatWithID",
  //   });
  //   console.log('cc',cc)
  // }

  socket.on("users", (users) => {
    users.forEach((user) => {
      if (user.userID === socket.id) {
        user.self = true
        setMe(user);
      }
    });
    // put the current user first, and then sort by username
    users = users.sort((a, b) => {
      if (a.self) return -1;
      if (b.self) return 1;
      if (a.username < b.username) return -1;
      return a.username > b.username ? 1 : 0;
    });

    setAllUser(users);//[this is in case there are already joined before me]
    //console.log('usersssssssssssssssssssssss-',users)
  });


  socket.on("user connected", (user, users) => {
    console.log('new user', user)
    //console.log('--updated list',users)//list of all users
    setAllUser(users)//updating the userslist[this is in case for user joining after]
  });

  // socket.off("connect_error");


  // Sign out function
  const signOut = () => {
    auth.signOut()
      .catch((error) => {
        console.error(error);
      });
  };


  async function getAllUsersList(){
    await getDocs(collection(firestore, "users"))
    .then((querySnapshot) => {
      const newData = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }));
      setAllUsersList(newData);
      console.log('alluserlist',newData);
    })
  }


  async function handleSearchUser(e){
    console.log('eee',e.target.value , allUsersList)

    let searchResult= allUsersList.filter(user=> user?.username?.includes(e.target.value))
    console.log('searchedUsers',searchResult)

  }



  return (
    <>
      <p style={{ fontSize: "8px" }} >here we will have a login page,,or maybe there is already,,from here the username will be take,,either from ggogle login or user create a accoundt,,,only the let user move forward..with that username the connection will be created in socket</p>

      {/* //  (<div >
    //     <h1 className="text-center">...</h1>
    //     <div className="d-flex flex-column ">
    //       <input type='text' name="username" onChange={e => setuser(user=>({...user,username:e.target.value}))} value={user.username} placeholder='username' />
    //       <input type='text' name="room" onChange={e => setuser(user=>({...user,room:e.target.value}))} value={user.room} placeholder='room' className="my-1"  />
    //       <button onClick={()=>joinRoom()} >JOIN</button>
    //     </div>
    //   </div>) */}


      <div className="outer">
        <div className="w3-sidebar  w3-animate-left w3-bar-block w3-border-right" style={{ display: "none" }} id="mySidebar" >
          <div>
            {/* <div className="sidebar-head">
              <span>close</span>
              <span onClick={() => sidebarVisibility(false)} className="closeButton" >
                &times;
              </span>
            </div> */}

            <span onClick={() => sidebarVisibility(false)} style={{position:"absolute",right:"-23px",color:"#fff"}} >
              <X size="20" />
            </span>
            
            <div className="p-2">
              <input type="search" onChange={e=>handleSearchUser(e)} className="rounded-3 p-1 px-2 w-100" placeholder="find friends" />
            </div>

            <div>
              {allUser?.map(x => {
                if (x.userID !== me.userID) {
                  return (<span data-uid={x.userID} className="w3-bar-item w3-button" onClick={e => chatThisGuy(e)} key={x.userID} >{x.username}</span>)
                }
              })}
            </div>
          </div>
          <section className="myProfile px-2">
            <span>
              {currentUser?.user?.displayName}
            </span>
            <LogOut size="20" onClick={() => signOut()} className='pointer' />
          </section>

        </div>

        <div className="chat-head">
          <div className="hamburger" onClick={() => sidebarVisibility(true)}>
            <img src={hamburger} alt="." />
          </div>
          {toChatWithSelected ?
            (<div className="chatWithProfile">
              <section id="chatWith"></section>
            </div>) : ""
          }
        </div>

        {toChatWithSelected ?
          (<div className="chat-body">
            <div className="chat-box">
              {wlcmMsg ? <p className="wlcmMsg">{wlcmMsg}</p> : null}

              {/* //for setting room users name */}
              {/* {roomUsersList?.map((x) => {
              return(<p key={x.uid}>{x.username}</p>)}
            )} */}

              {allMessages?.map((msgData) => {
                return <MessageWrapper msgData={msgData} me={me} />
              })}
              <div ref={dummy}></div>
            </div>

            <div className="msg-input form-control">
              <input
                type="text"
                name="msg"
                id="theText"
                placeholder="type..."
                className="my-1"
                onKeyPress={(e) => e.key === "Enter" && sendMsg()}
                autoComplete="off"
              />

              <button onClick={() => sendMsg()}>send</button>
            </div>
          </div>)
          :
          <div className="noOneToChat">
            <section onClick={() => dispatch({ type: "MESSAGE", payload: 4 })}>Select someone to chat with or Join a room</section>
          </div>
        }
      </div>

    </>
  )
}
