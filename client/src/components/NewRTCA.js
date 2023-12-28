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
import { LogOut, X } from 'lucide-react';


import { getFirestore, collection, query, where, doc, orderBy, getDocs, getDoc, addDoc, setDoc, serverTimestamp, toDate, limit, updateDoc, onSnapshot, } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { dbUsers } from "../utils";


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
  const currentUser = useSelector(state => state.user.userData)
  console.log('currentUser', currentUser)


  const navigate = useNavigate()
  const auth = getAuth();



  //-------XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-----from chat.js file --------XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX------
  const [currentMsg, setcurrentMsg] = useState("");//typed text
  const [roomUsersList, setRoomUsersList] = useState([]);//room users list[will be used when room feature will be implemented]


  const [allUsersList, setAllUsersList] = useState() // all the existing users in the db
  const [searchedUserList, setSearchedUserList] = useState() // queries user list
  const [selectedUserToChat,setSelectedUserToChat]=useState() 
  const [messageList, setMessageList]=useState() //messages with the current user
  const [currentText,setcurrentText]=useState('') // currently typed text
  const [userData,setUserData]=useState() // user info like connection list, email


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
      const docRef = await addDoc(collection(firestore, "v2"), msgObj);
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
  }, []);//it had socket as the dependency earlier



  const sidebarVisibility = (val) => {
    let sidebar = document.getElementById("mySidebar");
  
    if(val){
      sidebar.style.display = "flex";
      document.querySelector('.overlay').classList.remove('d-none')//add overlay
    }else{
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

  async function checkAuthStatus(){
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
    // await getDocs(collection(firestore, "users"))
    // .then((querySnapshot) => {
    //   const newData = querySnapshot.docs
    //     .map((doc) => ({ ...doc.data(), id: doc.id }));
    //   setAllUsersList(newData);
    //   console.log('alluserlist',newData);
    // })
  }


  async function getCurrentUserData(username){

    //when the connection is not found in cached data only then go further and query db to check if the connection is created recently
console.log('cucucucuucuc', currentUser)
let userObj;
    const q = query(collection(firestore, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    //thers no need to put it on a loop , there should be only one record, isnt there any getDoc option for just one doc
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      userObj=doc.data();
      userObj.id=doc.id
      setUserData(userObj)
    });
    return userObj;
  }





  async function handleSearchUser(e) {
    console.log('eee', e.target.value, allUsersList)

    //add debouncing here
    let result = allUsersList.filter(user => user?.username?.includes(e.target.value))
    console.log('searchedUsers', result,e.target.value.length)

    if (e.target.value.length === 0) {
      document.querySelector('.no-item')?.classList.remove('d-none')
      setSearchedUserList(undefined)  //clearing all records
      document.getElementById('userSearchDropdown').classList.add('d-none')//hide search list
    }else{
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

  function handleSelectedUserToChat(username){
     //dispatch an event and set the state there (may or may not be required)

     sidebarVisibility(false)//closing sidebar
     setSelectedUserToChat(username);//setting selected user

     //set messages
     retrieveTexts(username);
  }
  
  async function retrieveTexts(userToChat){

    console.log('ud',userData?.connections,userToChat)
    if (userData?.connections?.hasOwnProperty(userToChat)){
      console.log('has own property')
      let connectionId = userData?.connections[userToChat]// this can be set as a state 

      //with the connection if query the msgs collection and get all the msggs
      let q = query(collection(firestore, "v2"), where("connectionId", "==", connectionId), orderBy("time", "desc"), limit(20));

      //in here also there is a change that user has a connection but never chated with him so we need to run the below else part here too
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((doc) => {
          let data =doc.data()
          data.id=doc.id;
            msgs.push(data);
        });
        msgs.reverse()
        console.log("Current messages: ", msgs);
        setMessageList(msgs)
        dummy.current?.scrollIntoView({ behaviour: 'smooth' })
      });


    }else{
      console.log('is not a connection')
      let section=document.createElement('section')
      section.style.margin="auto"
      section.innerHTML="No messages yet..."
      let chatBox=document.getElementById('chatBox')
      chatBox.innerHTML=''
      chatBox.append(section)
      //add a note that say hi, or start a chat
    }
    


  }
    
  async function sendText(){
    if (currentText !== "" ) {
      console.log('currentText',currentText,currentUser.displayName)


      console.log('current user data',userData)


      let connectionId;
      
      //checks for connection id after retreiving fresh/updated data
      async function getConnectionId(){
        let result= await getCurrentUserData(currentUser.displayName)//calling this here to get updated list of all connections user has.. 
        console.log('ressukt',result)
        if(result?.connections?.hasOwnProperty(selectedUserToChat)){
          connectionId=result?.connections[selectedUserToChat]
          return;
        }

        connectionId = uuidv4(); // creating a new connection id
        const userDocRef = doc(firestore, "users", userData.id);
        //updating the user document with new connection
        await updateDoc(userDocRef, {
          connections: {
            ...userData.connections,
            [selectedUserToChat]:connectionId,
          }
        });
      }

      // check if userdata has the connection already and if not than add the connection in user collection
      if (userData?.connections?.hasOwnProperty(selectedUserToChat)){
        console.log('has own property')
        connectionId=userData?.connections[selectedUserToChat]
      }else{
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
                  <section className="dropdown-item pointer" key={x.id} onClick={e => handleSelectedUserToChat(x?.username)} style={{width:"unset",margin: "0 0.5rem"}}>
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
            <div className="chatWithProfile">
              <section id="chatWith">{selectedUserToChat}</section>
            </div>
          }
        </div>
        {/***** CHAT HEADER ENDS ******/}


        {/***** CHAT BODY STARTS ******/}
        {selectedUserToChat ?
          <div className="chat-body">
            <div className="chat-box" id="chatBox">
              {wlcmMsg ? <p className="wlcmMsg">{wlcmMsg}</p> : null}

              {messageList?.map((msgData) => {
                return <MessageWrapper msgData={msgData} myself={currentUser?.displayName} key={msgData.id} />
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
                value={currentText}
                onChange={e=>setcurrentText(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && sendText()}
                autoComplete="off"
              />

              <button onClick={() => sendText()}>send</button>
            </div>
          </div>
          :
          // show connection list here if no on is selected to chat... and if no one is in the connections then change the below msgs to seach a frient and start a convo by serching a frnd
          (userData?.connections?.length>0 ?
            (
              userData?.connections?map(x=>{
                return (<div></div>)
              })
            )
              :
          <div className="noOneToChat">
            <section onClick={() => dispatch({ type: "MESSAGE", payload: 4 })}>Select someone to chat with or start a group</section>
          </div>
            )
        }
        {/***** CHAT BODY ENDS ******/}


        <div className="overlay d-none" onClick={() => sidebarVisibility(false)}></div>
      </div>

    </>
  )
}
