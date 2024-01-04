import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';


import hamburger from "./../assets/menu.png";
import notification from "./../assets/discord.mp3";
import MessageWrapper from "./MessageWrapper";
import { UPDATE_USER_INFO } from "../redux/actionTypes";
import { dbUsers, debounce, hideSearchedUsersList, sidebarVisibility, writeToDb } from "../utils";
import { ChevronLeft, LogOut, Send, X, Users, UserPlus2, UserPlus, Users2, Delete, DeleteIcon, Trash } from 'lucide-react';


import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, doc, orderBy, getDocs, getDoc, addDoc, setDoc, serverTimestamp, toDate, limit, updateDoc, onSnapshot, } from "firebase/firestore";



export const NewRTCA = ({ firebaseApp }) => {

  const auth = getAuth();
  const db = getFirestore(firebaseApp);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  let prevDate = '';
  const dummy = useRef();
  const [allUsersList, setAllUsersList] = useState() // all the existing users in the db
  const [searchedUserList, setSearchedUserList] = useState() // queries user list
  const [selectedUserToChat, setSelectedUserToChat] = useState()
  const [messageList, setMessageList] = useState() //messages with the current user
  const [currentText, setcurrentText] = useState('') // currently typed text
  const [userData, setUserData] = useState() // user info like connection list, email
  const [connectionHeader, setConnectionHeader] = useState(true)
  const [connectionsToShow, setConnectionsToShow] = useState([]);//connection request list to show

  const currentUser = useSelector(state => state.user.userData)
  console.log('currentUser', currentUser)
  console.log('connectionsToShow-', connectionsToShow)


  useEffect(() => {
    async function fetchData() {
      console.log('userdataaaa', userData)
      const connections = [];
      if (Object.keys(userData?.requests)) {
        for (const uName of Object.keys(userData?.requests)) {
          const hasNewMessages = await getConnectionRequests(uName);
          if (hasNewMessages) {
            connections.push(uName);
          }
        }
      }
      setConnectionsToShow(connections);
    };

    //seeting connection req list
    if (userData) fetchData();

  }, [userData])


  useEffect(() => {
    // const currentUser = auth.currentUser;

    //send this function to utils as it might be called for on eor mor component
    checkAuthStatus();

    //getting all users (have to mve it somewhere whwere eit wont run on every stsate chnages, as its calling db on every stsata chnages decreasing the reads per day... add in usememo, usecallback)
    getAllUsersList()

  }, [])


  async function checkAuthStatus() {
    await auth.onAuthStateChanged((user) => {
      // console.log('authstate changed NWRTC', user)
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

    // commented for testing
    // await getDocs(collection(db, "users"))
    // .then((querySnapshot) => {
    //   const newData = querySnapshot.docs
    //     .map((doc) => ({ ...doc.data(), id: doc.id }));
    //   setAllUsersList(newData);
    //   console.log('alluserlist',newData);
    // })
  }


  async function getCurrentUserData(username) {
    //when the connection is not found in cached data only then go further and query db to check if the connection is created recently
    let userObj;
    const q = query(collection(db, "users"), where("username", "==", username));

    //for getting real-time updates of user doc
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // console.log("UPDATED USER => ", doc.data());
        userObj = doc.data();
        userObj.id = doc.id
        setUserData(userObj)
      });
    });
    console.log('USEROBJ------_________', userObj)

    return userObj;
  }



  async function getConnectionRequests(uName, i) {

    let connectionId = userData?.requests?.[uName]?.id;
    let deletedTill = userData?.requests?.[uName]?.deletedTill;

    // console.log('getConnectionRequests func_--------------------', uName)

    if (deletedTill) {
      let q = query(collection(db, "v2"), where("connectionId", "==", connectionId), where("time", ">", deletedTill), orderBy("time", "desc"), limit(1));

      const querySnapshot = await getDocs(q);
      // querySnapshot.forEach((doc) => {
      //   console.log("last msgs => ", doc.id, doc.data());
      //   // newMessages.push(doc.data());
      // });

      const hasNewMessages = querySnapshot.size > 0;
      return hasNewMessages;

    } else {
      return true;
    }
  }


  const showChatDate = (currDate) => {
    if (prevDate !== currDate) {
      prevDate = currDate;
      return true;
    }
    return false;
  }


  const signOut = () => {
    auth.signOut()
      .catch((error) => {
        console.error(error);
      });
  };


  const handleSearchUser = debounce(searchUser, 1000);

  const handleChangeUserSearch = (e) => {
    setSearchedUserList(undefined)  //clearing all records
    let userSearchDropdown = document.getElementById('userSearchDropdown')

    if (e.target.value.length === 0) {
      userSearchDropdown?.classList.add('d-none')//hide search list
    } else {
      userSearchDropdown?.classList.remove('d-none')//make search result visible
      document.querySelector('.custom-loader').classList.remove('d-none')//showing loader while typing
      document.querySelector('.no-item')?.classList.add('d-none')//hiding no item message while typing
      handleSearchUser(e);
    }
  }

  async function searchUser(e) {
    let result = allUsersList.filter(user => user?.username?.includes(e.target.value))

    let noResult = document.querySelector('.no-item')
    document.querySelector('.custom-loader')?.classList.add('d-none')//showing loader while typing

    if (result.length === 0) {
      noResult?.classList.remove('d-none')
      setSearchedUserList(undefined)  //clearing all records
    } else {
      noResult?.classList.add('d-none')
      setSearchedUserList(result)
    }
  }


  function handleSelectedUserToChat(username) {
    //dispatch an event and set the state there (may or may not be required)
    sidebarVisibility(false, setSearchedUserList)//closing sidebar
    setSelectedUserToChat(username);//setting selected user

    retrieveTexts(username);
  }


  // erorr;;{DONE,,few prioblem still exist like on new user msgs are nt refelecting right away}, reteriving of text is not working properly,, have to lsiten fir user doc chnages
  //when  i send a msg to a unknown user,, the msg doesnt show in ui right then
  async function retrieveTexts(userToChat) {
    console.log('ud', userData, userToChat)
    let connectionId = '';
    let chatsTill = null;

    //checking if the user in connection list or request list
    if (userData?.connections?.hasOwnProperty(userToChat)) {
      // console.log('has as connection')
      connectionId = userData?.connections[userToChat]?.id;// this can be set as a state 
      chatsTill = userData?.connections[userToChat]?.deletedTill
      getTexts(connectionId, chatsTill)
    } else if (userData?.requests?.hasOwnProperty(userToChat)) {
      // console.log('has as request')
      connectionId = userData?.requests[userToChat]?.id;// this can be set as a state 
      chatsTill = userData?.requests[userToChat]?.deletedTill
      getTexts(connectionId, chatsTill)
    } else {
      // console.log('is not a connection')
      setMessageList([])
    }
  }

  async function getTexts(connectionId, chatsTill) {
    // console.log('gettexts', connectionId, chatsTill)

    //only messages after last delete are queried
    let q;
    if (chatsTill) {
      q = query(collection(db, "v2"), where("connectionId", "==", connectionId), where("time", ">", chatsTill), orderBy("time", "desc"), limit(20));
    } else {
      q = query(collection(db, "v2"), where("connectionId", "==", connectionId), orderBy("time", "desc"), limit(20));
    }

    //in here also there is a change that user has a connection but never chated with him so we need to run the below else part here too
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data()
        data.id = doc.id;
        msgs.push(data);

        const audio = new Audio(notification);
        audio.play();
      });
      msgs.reverse()
      console.log("Current messages: ", msgs);
      setMessageList(msgs)
      dummy.current?.scrollIntoView({ behaviour: 'smooth' })
    });

  }

  async function sendText() {
    if (currentText !== "") {
      // console.log('currentText', currentText, currentUser.displayName)
      // console.log('current user data', userData)

      let connectionId;

      //checks for connection id after retreiving fresh/updated data
      async function getConnectionId() {
        //we might not need this the below likne to get updated current user after implementing snapshot on user doc
        let result = await getCurrentUserData(currentUser.displayName)//calling this here to get updated list of all connections user has.. 
        // console.log('ressukt', result)
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
          // console.log("RECIEVEER'S DOC => ", doc.data());
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
              id: connectionId,
            },
          }
        });
      }

      // check if userdata has the connection already and if not than add the connection in user collection
      if (userData?.connections?.hasOwnProperty(selectedUserToChat)) {
        // console.log('has own property')
        connectionId = userData?.connections[selectedUserToChat]?.id
      } else {
        //when the person is not a connection than add the current user and connectionid to request list
        // console.log('dont have property')
        await getConnectionId(selectedUserToChat)
      }


      const msgData = {
        connectionId: connectionId,
        author: currentUser.displayName,
        message: currentText,
        time: serverTimestamp(),
      };

      writeToDb(db, msgData);
      setcurrentText(''); // resetting input text field
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
            deletedTill: deletedTill,
          },
        }
      });
    }
  }

  async function declineConnectionReq() {

    //delete msgs here , don't remove from req list
    if (userData?.requests?.hasOwnProperty(selectedUserToChat)) {
      // delete userData.requests[selectedUserToChat];
      userData.requests[selectedUserToChat].deletedTill = serverTimestamp();

      //deleting connection req from req list 
      const docRef = doc(db, "users", userData?.id);
      await updateDoc(docRef, {
        requests: userData.requests,
      });

      setSelectedUserToChat(undefined)
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
        requests: {
          ...userData.requests,
          id: {
            id: connectionId,
            deletedTill: serverTimestamp(),
          }
        }
      });

      setSelectedUserToChat(undefined)
    }
  }

  return (
    <>
      <div className="outer">

        {/***** SIDEBAR STARTS ******/}
        <div className="w3-sidebar  w3-animate-left w3-bar-block w3-border-right" style={{ display: "none" }} id="mySidebar" >
          <div style={{ height: "90%" }}>
            {/* <div className="sidebar-head">
              <span>close</span>
              <span onClick={() => sidebarVisibility(false)} className="closeButton" > &times; </span>
            </div> */}

            <span onClick={() => sidebarVisibility(false)} className="pointer" style={{ position: "absolute", right: "-23px", color: "#fff" }} >
              <X size="20" />
            </span>

            <div className="p-2">
              <input type="search" onChange={e => handleChangeUserSearch(e)} className="rounded-3 p-1 px-2 w-100" placeholder="find friends" />
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
              <div className="no-item d-none text-center">No user found</div>
              <div className="custom-loader d-none" onClick={() => hideSearchedUsersList(setSearchedUserList)} ></div>
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

                <div className="request_list">
                  {connectionsToShow.map((uName, i) => (
                    <section key={i} className="request_list_item" onClick={() => handleSelectedUserToChat(uName)}>
                      {uName}
                    </section>
                  ))}
                  {/* {Object.keys(userData?.requests).map((uName, i) => (
                    <section key={i} className="request_list_item" onClick={() => handleSelectedUserToChat(uName)}>
                      {uName}
                      {newMessagesInfo[uName] && (
                        <div className="msg_preview">{newMessagesInfo[uName]?.message}</div>
                      )}
                    </section>
                  ))} */}
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
    </>
  )
}
