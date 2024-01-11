import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';


import hamburger from "./../assets/menu.png";
import notification from "./../assets/discord.mp3";
import MessageWrapper from "./MessageWrapper";
import Sidebar from "./Sidebar";
import { SET_CURRENT_USER, SET_USER_INFO } from "../redux/actionTypes";
import { dbUsers, debounce, hideSearchedUsersList, sidebarVisibility, writeToDb } from "../utils";
import { ChevronLeft, LogOut, Send, X, Users, UserPlus2, UserPlus, Users2, Delete, DeleteIcon, Trash, UserRoundX, UserCheck, UserCheck2, UserX, UserX2, Ban } from 'lucide-react';


import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, doc, orderBy, getDocs, getDoc, addDoc, setDoc, serverTimestamp, toDate, limit, updateDoc, onSnapshot, Timestamp, } from "firebase/firestore";



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
  // const [userData, setUserData] = useState() // user info like connection list, email
  const [connectionHeader, setConnectionHeader] = useState(true)
  const [connectionsToShow, setConnectionsToShow] = useState([]);//connection request list to show

  const [till,setTill]=useState(''); // has the date till when chats are deleted for selcted user

  const currentUser = useSelector(state => state.user.currentUser)
  const userData = useSelector(state => state.user.userInfo)
  console.log('currentUser', currentUser)
  console.log('connectionsToShow-', connectionsToShow)


  useEffect(() => {
    // const currentUser = auth.currentUser;

    //moved to app [10-1-24]
    // //send this function to utils as it might be called for one or more component
    // checkAuthStatus();

    //getting all users (have to mve it somewhere whwere eit wont run on every stsate chnages, as its calling db on every stsata chnages decreasing the reads per day... add in usememo, usecallback)
    getAllUsersList()

  }, [])

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

    //setting connection req list
    if (userData) {
      fetchData();
      if (selectedUserToChat) retrieveTexts(selectedUserToChat)
    }
  }, [userData])



  /* //moved to app [10-1-24]
  async function checkAuthStatus() {
    await auth.onAuthStateChanged((user) => {
      // console.log('authstate changed NWRTC', user)
      if (user) {
        dispatch({ type: SET_CURRENT_USER, payload: user })

        //have to store the result of this query in cache 
        getCurrentUserData(user.displayName);
      } else {
        dispatch({ type: SET_CURRENT_USER, payload: null })
        navigate('/')
      }
    });
  }
  */

  async function getAllUsersList() {

    //this should be moved to redux
    setAllUsersList(dbUsers);

    // //commented for testing  
    // await getDocs(collection(db, "users"))
    // .then((querySnapshot) => {
    //   const newData = querySnapshot.docs
    //     .map((doc) => ({ ...doc.data(), id: doc.id }));
    //   setAllUsersList(newData);
    //   console.log('alluserlist',newData);
    // })
  }

  /* //moved to app [10-1-24]
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
          // setUserData(userObj)
          dispatch({ type: SET_USER_INFO, payload: userObj })
        });
      });
      console.log('USEROBJ------_________', userObj)
  
      return userObj;
    }
    */



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






  function handleSelectedUserToChat(username) {
    //dispatch an event and set the state there (may or may not be required)
    sidebarVisibility(false, setSearchedUserList)//closing sidebar
    setSelectedUserToChat(username);//setting selected user

    retrieveTexts(username);
  }


  async function retrieveTexts(userToChat) {
    console.log('ud', userData, userToChat)
    let connectionId = '';
    let chatsTill = null;

    //checking if the user in connection list or request list
    if (userData?.connections?.hasOwnProperty(userToChat)) {
      console.log('has as connection')
      connectionId = userData?.connections[userToChat]?.id;// this can be set as a state 
      chatsTill = userData?.connections[userToChat]?.deletedTill
      getTexts(connectionId, chatsTill)
      // getTexts(connectionId, till)
    } else if (userData?.requests?.hasOwnProperty(userToChat)) {
      console.log('has as request')
      connectionId = userData?.requests[userToChat]?.id;// this can be set as a state 
      chatsTill = userData?.requests[userToChat]?.deletedTill
      getTexts(connectionId, chatsTill)
      // getTexts(connectionId, till)
    } else {
      console.log('is not a connection')
      setMessageList([])
    }
  }

  async function getTexts(connectionId, chatsTill) {
    // NOTE ::: SENDING MSGS RIGHT AFTER CLEARING CHATS IS PULLING BACK ALL THNE DELETE CHATS 
    let c;
    if (userData?.connections?.hasOwnProperty(selectedUserToChat)) {
      c = userData?.connections[selectedUserToChat]?.deletedTill
    } else if (userData?.requests?.hasOwnProperty(selectedUserToChat)) {
      c = userData?.requests[selectedUserToChat]?.deletedTill
    }
    console.log('gettexts', connectionId,selectedUserToChat,userData,c)


    //only messages after last delete are queried
    let q;
    // let q = query(collection(db, "v2"), where("connectionId", "==", connectionId), where("time", ">", chatsTill), orderBy("time", "desc"), limit(20));
    if (chatsTill) {
      q = query(collection(db, "v2"), where("connectionId", "==", connectionId), where("time", ">", chatsTill), orderBy("time", "desc"), limit(20));
    } else {
      q = query(collection(db, "v2"), where("connectionId", "==", connectionId), orderBy("time", "desc"), limit(20));
    }

    //in here also there is a change that user has a connection but never chated with him so we need to run the below else part here too
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      console.log('hiddenn')
      querySnapshot.forEach((doc) => {
        let data = doc.data()
        data.id = doc.id;
        msgs.push(data);

        //when msgs are sent than the deleted msgs were also getting loaded bcz upper query was not running, only the snapshot was running which pulls the new records, thats the reason that when on first load it works fine bcz then the query used to run nut on sendText it does not
 console.log('chatsTillchatsTillchatsTillchatsTillchatsTillchatsTillchatsTillchatsTill',chatsTill)


        //only play sound if the message's timestamp and current timestap are close (in btw 2s)
        const date1 = data.time?.toDate();
        const date2 = new Date();
        const diffTime = Math.abs(date2 - date1);
        if (diffTime <= 2000) {
          const audio = new Audio(notification);
          audio.play();
        }
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
        console.log('userdddtatatatatat', userData)
        //we might not need this the below likne to get updated current user after implementing snapshot on user doc
        //let result = await getCurrentUserData(currentUser.displayName)//calling this here to get updated list of all connections user has.. 
        // console.log('ressukt', result)
        if (userData?.connections?.hasOwnProperty(selectedUserToChat)) {
          connectionId = userData?.connections[selectedUserToChat]?.id;
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

        // await getConnectionId(selectedUserToChat)
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


  async function clearChat(id) {

    //connection is moved to req list after deleting msgs
    console.log('clearChats', id)
    if (userData?.connections?.hasOwnProperty(id)) {

      // let connectionId = userData.connections[id]?.id;
      userData.connections[id].deletedTill = serverTimestamp();

      //deleting connection req from req list 
      const docRef = doc(db, "users", userData?.id);
      await updateDoc(docRef, {
        connections: userData.connections,
      });

      // setSelectedUserToChat(undefined)
    }
  }



  async function acceptConnectionReq(userName) {
    console.log('acceptConnectionReq', userName)

    if (userData?.requests?.hasOwnProperty(userName)) {

      let connectionId = userData.requests[userName]?.id;
      let deletedTill = userData.requests[userName]?.deletedTill || Timestamp.fromDate(new Date('1970'));

      // console.log('connecyion id', connectionId, userData.requests)

      delete userData.requests[userName];
      console.log('connection id after', connectionId, userData)

      //moving connection from req list to connection list 
      const docRef = doc(db, "users", userData?.id);
      await updateDoc(docRef, {
        requests: userData.requests,
        connections: {
          ...userData.connections,
          [userName]: {
            id: connectionId,
            deletedTill: deletedTill,
          },
        }
      });
    }
  }

  async function declineConnectionReq(userName) {

    //delete msgs here , don't remove from req list
    if (userData?.requests?.hasOwnProperty(userName)) {
      // delete userData.requests[userName];
      userData.requests[userName].deletedTill = serverTimestamp();

      //deleting connection req from req list 
      const docRef = doc(db, "users", userData?.id);
      await updateDoc(docRef, {
        requests: userData.requests,
      });

      setSelectedUserToChat(undefined)
    }
  }

  async function deleteConnection(id) {

    //connection is moved to req list after deleting msgs
    console.log('deleteConnection', id)
    if (userData?.connections?.hasOwnProperty(id)) {

      let connectionId = userData.connections[id]?.id;
      delete userData.connections[id];

      //deleting connection req from req list 
      const docRef = doc(db, "users", userData?.id);
      await updateDoc(docRef, {
        connections: userData.connections,
        requests: {
          ...userData.requests,
          [id]: {
            id: connectionId,
            deletedTill: serverTimestamp(),
          }
        }
      });

      setSelectedUserToChat(undefined)
    }
  }

  async function blockConnection(id) {

    let connectionId = '';
    //connection is moved to block list from connection list or req list / messages are not deketed
    console.log('id', id)
    //current only connection list is handled here
    if (userData?.connections?.hasOwnProperty(id)) {
      connectionId = userData.connections[id]?.id;
      delete userData.connections[id];
      updateUserDoc();
    } else if (userData?.requests?.hasOwnProperty(id)) {
      connectionId = userData.requests[id]?.id;
      delete userData.requests[id];
      updateUserDoc();
    }

    async function updateUserDoc() {

      //deleting connection req from req list 
      const docRef = doc(db, "users", userData?.id);
      await updateDoc(docRef, {
        connections: userData.connections,
        requests: userData.requests,
        blockList: {
          ...userData.blockList,
          [id]: {
            id: connectionId,
            blockedAt: serverTimestamp(),
          }
        }
      });

      setSelectedUserToChat(undefined)//only call when inner block button is clicked, not on list's btn, so that component wont render bcz of unneccesary state update
    }
  }

  return (
    <>
      <div className="outer">

        {/***** SIDEBAR STARTS ******/}
        <Sidebar
          allUsersList={allUsersList}
          searchedUserList={searchedUserList}
          setSearchedUserList={setSearchedUserList}
          handleSelectedUserToChat={handleSelectedUserToChat}
        />
        {/***** SIDEBAR ENDS ******/}


        {/***** CHAT HEADER STARTS ******/}
        <div className="chat-head">
          <div className="hamburger" onClick={() => sidebarVisibility(true, setSearchedUserList)}>
            <img src={hamburger} alt="." />
          </div>
          {selectedUserToChat &&
            <div className="d-flex align-items-center">
              <ChevronLeft className="pointer" onClick={() => setSelectedUserToChat(undefined)} />
              <section id="chatWith">{selectedUserToChat}</section>

              <div className="dropdown">
                <div className="chatWithProfile ms-1" type="button" data-bs-toggle="dropdown" aria-expanded="false"></div>
                {userData?.connections.hasOwnProperty(selectedUserToChat) &&
                  <ul className="dropdown-menu p-2">
                    <li className="dropdown-item pointer" onClick={() => clearChat(selectedUserToChat)}>Clear chats</li>
                    <li className="dropdown-item pointer" onClick={() => blockConnection(selectedUserToChat)}>Block connection</li>
                    <li className="dropdown-item pointer" onClick={() => deleteConnection(selectedUserToChat)}>Remove connection</li>
                  </ul>
                }
              </div>

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

              {/* this should be the main badge indicator */}
              {connectionsToShow.length}-
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
                    <div key={msgData.id} className="d-flex flex-column">
                      {showChatDate(currDate) &&
                        <div className="text-center date">
                          <span className="fs-12">{currDate}</span>
                        </div>
                      }
                      <MessageWrapper msgData={msgData} myself={currentUser?.displayName} />
                    </div>
                  )
                })
                :
                <section className="m-auto">No messages yet...</section>}
              <div ref={dummy}></div>
            </div>
            {userData?.requests[selectedUserToChat] ?
              <div className="req_btn">
                <section className="enq_btn accept" onClick={() => acceptConnectionReq(selectedUserToChat)} >Accept</section>
                <section className="enq_btn delete mt-1" onClick={() => declineConnectionReq(selectedUserToChat)}>Delete</section>
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
                        <section className="deleteConnection" onClick={() => deleteConnection(x)} title="Delete connection">
                          {/* <Trash size={18} /> */}
                          <UserRoundX size={18} />
                        </section>
                        <section className="blockConnection" onClick={() => blockConnection(x)} title="Block connection">
                          {/* <UserRoundX size={18} /> */}
                          <Ban size={18} />
                        </section>
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
                    <div className="list" key={i}>
                      <section key={i} className="request_list_item" onClick={() => handleSelectedUserToChat(uName)}>
                        {uName}
                      </section>
                      <section className="acceptReq" onClick={() => acceptConnectionReq(uName)} title="Accept connection">
                        <UserCheck2 size={18} />
                      </section>
                      <section className="declineReq" onClick={() => declineConnectionReq(uName)} title="Decline connection">
                        {/* <Trash size={18} /> */}
                        <UserRoundX size={18} />
                      </section>
                      <section className="blockReq" onClick={() => blockConnection(uName)} title="Block connection">
                        {/* <UserRoundX size={18} /> */}
                        <Ban size={18} />
                      </section>
                    </div>
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


        <div className="overlay pointer d-none" onClick={() => sidebarVisibility(false, setSearchedUserList)}></div>
      </div>
    </>
  )
}
