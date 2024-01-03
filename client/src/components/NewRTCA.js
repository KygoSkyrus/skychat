import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import ScrollToBottom from "react-scroll-to-bottom";
// import socketIOClient from "socket.io-client";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';


import hamburger from "./../assets/menu.png";
import notification from "./../assets/discord.mp3";
import MessageWrapper from "./MessageWrapper";
import { UPDATE_USER_INFO } from "../redux/actionTypes";
import { ChevronLeft, LogOut, Send, X, Users, UserPlus, UserPlus2, Users2, Delete, DeleteIcon, Trash } from 'lucide-react';


import { getFirestore, collection, query, where, doc, orderBy, getDocs, getDoc, addDoc, setDoc, serverTimestamp, toDate, limit, updateDoc, onSnapshot, } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { dbUsers, getDateStr, getFullDateStr } from "../utils";


// const socket = socketIOClient('http://localhost:3000');
const socket = io('http://localhost:3000', { autoConnect: false });//getting this out of the compoments bvcz when it was in,,it used to create a new seocket on every rerender

//So that any event received by the client will be printed in the console.
socket.onAny((event, ...args) => {
  console.log('triggered event :- ', event, args);
});

export const NewRTCA = ({ firebaseApp }) => {
  let prevDate = '';

  const [user, setuser] = useState({ username: "", room: "" })
  const [letMeIn, setLetMeIn] = useState(false);
  //new states
  const [me, setMe] = useState()
  const [allUser, setAllUser] = useState()


  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user.userData)
  console.log('currentUser', currentUser)


  const navigate = useNavigate()
  const auth = getAuth();



  //-------XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-----from chat.js file --------XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX------
  const [currentMsg, setcurrentMsg] = useState("");//typed text
  const [roomUsersList, setRoomUsersList] = useState([]);//room users list[will be used when room feature will be implemented]


  const [allUsersList, setAllUsersList] = useState() // all the existing users in the db
  const [searchedUserList, setSearchedUserList] = useState() // queries user list
  const [selectedUserToChat, setSelectedUserToChat] = useState()
  const [messageList, setMessageList] = useState() //messages with the current user
  const [currentText, setcurrentText] = useState('') // currently typed text
  const [userData, setUserData] = useState() // user info like connection list, email
  const [connectionHeader, setConnectionHeader] = useState(true)

  const [toChatWithSelected, setToChatWithSelected] = useState(false);
  const [toChatWithID, setToChatWithID] = useState();//has the id of the othe person who is selected to have chat with
  const [wlcmMsg, setwlcmMsg] = useState();//yet to implement [only for rooms]
  const dummy = useRef();


  const sessionID = localStorage.getItem("sessionID");
  console.log('sessionid', sessionID)

  //fsp try----------------
  //have to check why its calling db one evry leter typed
  let dbQuery;
  const db = getFirestore(firebaseApp);
  if (toChatWithID) {
    //the reason why hen where is set to to is now returning any result bcz thers is order by and we havent indesx time with to,,,have to create a composite index ot time and to
    dbQuery = query(collection(db, "v1"), where("to", "==", toChatWithID), orderBy("time", "desc"), limit(20));//if you limit the record then they will give you the first few records..but we want records from below,,,so set the order to descending,,also set indexed in firebase
  }
  // const [allMessages] = useCollectionData(dbQuery, { idField: 'id' })
  // allMessages?.reverse()//here reversed the returned msgs list array,,so that we have latest at first
  // console.log('allmessages-----------',allMessages)
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
      const docRef = await addDoc(collection(db, "v2"), msgObj);
      console.log("message send with ID: ", docRef.id);
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
  }, []);//it had socket as the dependency earlier



  const sidebarVisibility = (val) => {
    let sidebar = document.getElementById("mySidebar");

    if (val) {
      sidebar.style.display = "flex";
      document.querySelector('.overlay').classList.remove('d-none')//add overlay
    } else {
      sidebar.style.display = "none";
      document.querySelector('.overlay').classList.add('d-none')//add overlay

      //these 3 lines are repeating below
      setSearchedUserList(undefined)  //clearing all records
      document.querySelector('[type="search"]').value = "";//clearing the input on focus out
      document.getElementById('userSearchDropdown').classList.add('d-none')//mnake serch result visible
    }
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


  // NEW APPROACH______________________________________________________________

  const showChatDate = (currDate) => {
    if (prevDate !== currDate) {
      prevDate = currDate;
      return true;
    }
    return false;
  }

  // Sign out function
  const signOut = () => {
    auth.signOut()
      .catch((error) => {
        console.error(error);
      });
  };


  useEffect(() => {
    // const currentUser = auth.currentUser;

    //send this function to utils as it might be called for on eor mor component
    checkAuthStatus();

    //getting all users (have to mve it somewhere whwere eit wont run on every stsate chnages, as its calling db on every stsata chnages decreasing the reads per day... add in usememo, usecallback)
    getAllUsersList()


  }, [])

  async function checkAuthStatus() {
    await auth.onAuthStateChanged((user) => {
      console.log('authstate changed NWRTC', user)
      if (user) {
        dispatch({ type: UPDATE_USER_INFO, payload: user })

        //have to store the result of this query in cache 
        getCurrentUserData(user.displayName);
      } else {
        dispatch({ type: UPDATE_USER_INFO, payload: null })
        navigate('/')
      }
    });
  }






  async function getAllUsersList() {

    setAllUsersList(dbUsers);

    // commenting for testing
    // await getDocs(collection(db, "users"))
    // .then((querySnapshot) => {
    //   const newData = querySnapshot.docs
    //     .map((doc) => ({ ...doc.data(), id: doc.id }));
    //   setAllUsersList(newData);
    //   console.log('alluserlist',newData);
    // })
  }


  //this user data is also needed to be set whenevrr user doc is updated, bcz only than the changes like requests and connections will be reflrect live
  async function getCurrentUserData(username) {
    //when the connection is not found in cached data only then go further and query db to check if the connection is created recently
    let userObj;
    const q = query(collection(db, "users"), where("username", "==", username));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log("USER UPDATED => ", doc.data());
    //   userObj = doc.data();
    //   userObj.id = doc.id
    //   setUserData(userObj)
    // });

    //fo getting real-time updates of user doc
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("UPDATED USER => ", doc.data());
        userObj = doc.data();
        userObj.id = doc.id
        setUserData(userObj)
      });
    });
    console.log('CUCUCUCUUCUC_C_C_C_C_C_C_', userObj)


    return userObj;
  }



  async function getConnectionRequests(uName,i){

    let connectionId= userData?.requests?.[uName]?.id;
    let deletedTill= userData?.requests?.[uName]?.deletedTill;

    console.log('getConnectionRequests func_--------------------',uName)


    if(deletedTill){
      //check if there are new msgs
      return <section className="request_list_item"> nbvbz</section>
    }else{
      return <section className="request_list_item" key={i} onClick={() => handleSelectedUserToChat(uName)} >{uName}</section>
    }
  }




  async function handleSearchUser(e) {
    console.log('eee', e.target.value, allUsersList)

    //add debouncing here
    let result = allUsersList.filter(user => user?.username?.includes(e.target.value))
    console.log('searchedUsers', result, e.target.value.length)

    if (e.target.value.length === 0) {
      document.querySelector('.no-item')?.classList.remove('d-none')
      setSearchedUserList(undefined)  //clearing all records
      document.getElementById('userSearchDropdown').classList.add('d-none')//hide search list
    } else {
      document.querySelector('.no-item')?.classList.add('d-none')
      document.getElementById('userSearchDropdown').classList.remove('d-none')//mnake serch result visible
    }


    setSearchedUserList(result)
  }

  function hideSearchedUsersList(e) {
    document.querySelector('[type="search"]').value = "";//clearing the input on focus out
    document.getElementById('userSearchDropdown').classList.toggle('d-none')//hiding the dropdown
    // document.querySelector('.search-overlay').classList.add('display-none')//removing the overlay
    // const root = document.getElementById('root')
    // root.style.height = "unset"
    // root.style.overflow = "unset"
    setSearchedUserList(undefined)
    // handleNavBar(true)//to close navbar and hide overlay
  }

  function handleSelectedUserToChat(username) {
    //dispatch an event and set the state there (may or may not be required)

    sidebarVisibility(false)//closing sidebar
    setSelectedUserToChat(username);//setting selected user

    //set messages
    retrieveTexts(username);
  }

  // erorr;;{DONE,,few prioblem still exist like on new user msgs are nt refelecting right away} else condityion neededs to be changes,,reteriving of text is not working properly,, have to lsiten fir user doc chnages
  //when  i send a msg to a unknown user,, the msg doesnt show in ui right then
  //NOTE:::{DONE} make user update whenever doc is modified
  async function retrieveTexts(userToChat) {
    console.log('ud', userData, userToChat)
    let connectionId = '';
    let chatsTill=null;

    //only allow msgs which fall  after the deletedtill timestamp

    //checking if the user in connection list or request list
    if (userData?.connections?.hasOwnProperty(userToChat)) {
      console.log('has as connection')
      connectionId = userData?.connections[userToChat]?.id;// this can be set as a state 
      chatsTill =userData?.connections[userToChat]?.deletedTill
      getTexts(connectionId,chatsTill)
    } else if (userData?.requests?.hasOwnProperty(userToChat)) {
      console.log('has as request')
      connectionId = userData?.requests[userToChat]?.id;// this can be set as a state 
      chatsTill=userData?.requests[userToChat]?.deletedTill
      getTexts(connectionId,chatsTill)
    } else {
      console.log('is not a connection')
      setMessageList([])
    }


  }

  async function getTexts(connectionId,chatsTill) {
    //with the connection if query the msgs collection and get all the msggs
    console.log('gettexts',connectionId,chatsTill)
    let q;
    if(chatsTill){
      q = query(collection(db, "v2"), where("connectionId", "==", connectionId), where("time", ">", chatsTill), orderBy("time", "desc"), limit(20));
    }else{
      q = query(collection(db, "v2"), where("connectionId", "==", connectionId), orderBy("time", "desc"), limit(20));
    }

    //in here also there is a change that user has a connection but never chated with him so we need to run the below else part here too
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data()
        data.id = doc.id;
        msgs.push(data);
      });
      msgs.reverse()
      console.log("Current messages: ", msgs);
      setMessageList(msgs)
      dummy.current?.scrollIntoView({ behaviour: 'smooth' })
    });

  }

  async function sendText() {
    if (currentText !== "") {
      console.log('currentText', currentText, currentUser.displayName)
      console.log('current user data', userData)


      let connectionId;

      //checks for connection id after retreiving fresh/updated data
      async function getConnectionId() {
        //we might not need this the below likne to get updated current user after implementing snapshot on user doc
        let result = await getCurrentUserData(currentUser.displayName)//calling this here to get updated list of all connections user has.. 
        console.log('ressukt', result)
        if (result?.connections?.hasOwnProperty(selectedUserToChat)) {
          connectionId = result?.connections[selectedUserToChat]?.id;
          return;
        }

        connectionId = uuidv4(); // creating a new connection id
        const userDocRef = doc(db, "users", userData.id);
        //updating the user document with new connection
        ///initailly add past time like 1970 in deltedTill
        await updateDoc(userDocRef, {
          connections: {
            ...userData.connections,
            [selectedUserToChat]: {
              id: connectionId,
            },
          }
        });

        //getting receiver's doc
        let receiverDoc;
        let q = query(collection(db, "users"), where("username", "==", selectedUserToChat));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log("RECIEVEER'S DOC => ", doc.data());
          receiverDoc = doc.data()
          receiverDoc.id = doc.id;
          return;
        });
        console.log('RECIEVEER"S DOC --', receiverDoc)

        //updating the receiver document request list
        const receiverDocRef = doc(db, "users", receiverDoc.id);
        await updateDoc(receiverDocRef, {
          requests: {
            ...receiverDoc.requests,
            [currentUser.displayName]: {
              id:connectionId,
            },
          }
        });
      }

      // check if userdata has the connection already and if not than add the connection in user collection
      if (userData?.connections?.hasOwnProperty(selectedUserToChat)) {
        console.log('has own property')
        connectionId = userData?.connections[selectedUserToChat]?.id
      } else {
        //when the person is not a connection than add the current user and connectionid to request list
        console.log('dont have property')
        await getConnectionId(selectedUserToChat)
      }


      const msgData = {
        connectionId: connectionId,
        author: currentUser.displayName,
        message: currentText,
        time: serverTimestamp(),
      };
      console.log('msgdata', msgData)


      readWriteDb(msgData);

      // const chatBox = document.querySelector(".chat-box");
      //chatBox.scrollTop = chatBox.scrollHeight+10;//to scroll to bottom

      setcurrentText(''); // resetting input text field
      //dummy.current?.scrollIntoView({ behaviour: 'smooth' })//moved to reterive text
    }
  }


  async function acceptConnectionReq() {

    if (userData?.requests?.hasOwnProperty(selectedUserToChat)) {

      let connectionId = userData.requests[selectedUserToChat]?.id
      let deletedTill = userData.requests[selectedUserToChat]?.deletedTill;

      console.log('connecyion id', connectionId, userData.requests)

      delete userData.requests[selectedUserToChat];
      console.log('connection id after', connectionId, userData.requests)

      //moving connection from req list to connection list 
      const docRef = doc(db, "users", userData?.id);
      await updateDoc(docRef, {
        requests: userData.requests,
        connections: {
          ...userData.connections,
          [selectedUserToChat]: {
            id: connectionId,
            deletedTill:deletedTill,
          },
        }
      });
    }
  }

  async function declineConnectionReq() {

    //delete msgs here , don't remove from req list
    if (userData?.requests?.hasOwnProperty(selectedUserToChat)) {
      // delete userData.requests[selectedUserToChat];
      userData.requests[selectedUserToChat].deletedTill=serverTimestamp();

      //deleting connection req from req list 
      const docRef = doc(db, "users", userData?.id);
      await updateDoc(docRef, {
        requests: userData.requests,
      });
    }
  }

  async function deleteConnection(id) {

    //dont delete the connection,, either move the connection to req list and delete msgs so that if the other guy sends a msgs again(bcz for him u r still his a connection) than it will be shown in req list,
    
    console.log('id', id)
    if (userData?.connections?.hasOwnProperty(id)) {

      let connectionId = userData.connections[id]?.id;
      delete userData.connections[id];

      //deleting connection req from req list 
      const docRef = doc(db, "users", userData?.id);
      await updateDoc(docRef, {
        connections: userData.connections,
        requests:{
          id: connectionId,
          deletedTill: serverTimestamp(),
        }
      });
    }
  }

  return (
    <>
      <div className="outer">

        {/***** SIDEBAR STARTS ******/}
        <div className="w3-sidebar  w3-animate-left w3-bar-block w3-border-right" style={{ display: "none" }} id="mySidebar" >
          <div>
            {/* <div className="sidebar-head">
              <span>close</span>
              <span onClick={() => sidebarVisibility(false)} className="closeButton" > &times; </span>
            </div> */}

            <span onClick={() => sidebarVisibility(false)} className="pointer" style={{ position: "absolute", right: "-23px", color: "#fff" }} >
              <X size="20" />
            </span>

            <div className="p-2">
              <input type="search" onChange={e => handleSearchUser(e)} className="rounded-3 p-1 px-2 w-100" placeholder="find friends" />
            </div>

            <div className="d-none" id="userSearchDropdown">
              {searchedUserList?.map(x => {
                return (
                  <section className="dropdown-item pointer" key={x.id} onClick={e => handleSelectedUserToChat(x?.username)} style={{ width: "unset", margin: "0 0.5rem" }}>
                    {/* <img className="me-3" src={x.image} alt="shoppitt" height="50px" width="55px" /> */}
                    <span>{x?.username}</span>
                  </section>
                )
              })}
              <div className="no-item d-none">No item found</div>
              <div className="custom-loader d-none" onClick={() => hideSearchedUsersList()} ></div>
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
              {currentUser?.displayName}
            </span>
            <LogOut size="20" onClick={() => signOut()} className='pointer' />
          </section>

        </div>
        {/***** SIDEBAR ENDS ******/}


        {/***** CHAT HEADER STARTS ******/}
        <div className="chat-head">
          <div className="hamburger" onClick={() => sidebarVisibility(true)}>
            <img src={hamburger} alt="." />
          </div>
          {selectedUserToChat &&
            <div className="d-flex align-items-center">
              <ChevronLeft className="pointer" onClick={() => setSelectedUserToChat(undefined)} />
              <section id="chatWith">{selectedUserToChat}</section>
              <div className="chatWithProfile ms-1"></div>
            </div>
          }
        </div>

        {!selectedUserToChat &&
          <div className="header d-grid text-light">
            <section
              className={`connection_header pointer ${connectionHeader ? 'header_shadow' : 'connection_header_sm'}`}
              onClick={() => setConnectionHeader(true)}>
              {connectionHeader ? "Connections" : <Users size={15} />}
            </section>
            <section
              className={`request_header pointer bg-danger ${!connectionHeader && 'header_shadow request_header_lg'}`} onClick={() => setConnectionHeader(false)}>
              {connectionHeader ? <UserPlus2 size={15} /> : <span className="me-1">Connection Requests</span>}

              {userData?.requests && Object.keys(userData?.requests)?.length > 0 &&
                <span className="req_badge">
                  {Object.keys(userData?.requests)?.length}
                </span>}
            </section>
          </div>
        }

        {/***** CHAT HEADER ENDS ******/}


        {/***** CHAT BODY STARTS ******/}
        {selectedUserToChat ?
          <div className="chat-body" >
            <div className="chat-box" id="chatBox">
              {wlcmMsg ? <p className="wlcmMsg">{wlcmMsg}</p> : null}

              {messageList?.length > 0 ?
                messageList?.map((msgData) => {
                  let currDate = msgData?.time?.toDate().toLocaleDateString('en-in', { year: "numeric", month: "short", day: "numeric" });
                  return (
                    <>
                      {showChatDate(currDate) &&
                        <div className="text-center date">
                          <span className="fs-12">{currDate}</span>
                        </div>
                      }
                      <MessageWrapper msgData={msgData} myself={currentUser?.displayName} key={msgData.id} />
                    </>
                  )
                })
                :
                <section className="m-auto">No messages yet...</section>}
              <div ref={dummy}></div>
            </div>
            {userData?.requests[selectedUserToChat] ?
              <div className="req_btn">
                <section className="enq_btn accept" onClick={() => acceptConnectionReq()} >Accept</section>
                <section className="enq_btn delete mt-1" onClick={() => declineConnectionReq()}>Delete</section>
              </div>
              :
              <div className="msg-input form-control border-0">
                <input
                  type="text"
                  name="msg"
                  id="theText"
                  placeholder="...type"
                  className="my-1"
                  value={currentText}
                  onChange={e => setcurrentText(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && sendText()}
                  autoComplete="off"
                />
                <button onClick={() => sendText()} className="rounded-2" style={{ background: "#4b4b4b" }}><Send /></button>
              </div>}
          </div>
          :
          connectionHeader ?
            // can be converted to a component
            (userData?.connections ?
              Object.keys(userData?.connections)?.length > 0 ?

                <div className="chat_list">{
                  Object.keys(userData?.connections).map((x, i) => {
                    return (
                      <div className="list" key={i}>
                        <section className="chat_list_item" onClick={() => handleSelectedUserToChat(x)} >{x}</section>
                        <section className="deleteConnection" onClick={() => deleteConnection(x)} title="Delete connection"><Trash size={18} /></section>
                      </div>
                    )
                  })}
                </div>
                :
                <div className="noOneToChat">
                  <section onClick={() => dispatch({ type: "MESSAGE", payload: 4 })}>Add/search friends to start a chat or start a group</section>
                </div>
              :
              <div className="noOneToChat">fetching connections...</div>)
            :
            (userData?.requests ?
              Object.keys(userData?.requests)?.length > 0 ?

                <div className="request_list">{
                  Object.keys(userData?.requests).map((x, i) => {
                    let y= getConnectionRequests(x,i).then(y=>{
                      console.log('y',y)
                      return y
                    })
                   return y
                  })}
                </div>
                :
                <div className="noOneToChat">
                  <section>No new connection request</section>
                </div>
              :
              <div className="noOneToChat">Loading...</div>)
        }
        {/***** CHAT BODY ENDS ******/}


        <div className="overlay d-none" onClick={() => sidebarVisibility(false)}></div>
      </div>
      {/* <span class="enq_btn">SKYCHAT</span> */}
    </>
  )
}
