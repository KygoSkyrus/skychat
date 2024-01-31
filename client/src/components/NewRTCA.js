import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'


import hamburger from "./../assets/menu.png";
import Sidebar from "./Sidebar";
import ChatBox from "./ChatBox";
import { SET_CURRENT_USER, SET_USERS_LIST, SET_USER_INFO } from "../redux/actionTypes";
import { acceptConnectionReq, blockConnection, dbUsers, debounce, declineConnectionReq, hideSearchedUsersList, sidebarVisibility, writeToDb } from "../utils";
import { ChevronLeft, LogOut, Send, X, Users, UserPlus2, UserPlus, Users2, Delete, DeleteIcon, Trash, UserRoundX, UserCheck, UserCheck2, UserX, UserX2, Ban } from 'lucide-react';


import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, doc, orderBy, getDocs, getDoc, addDoc, setDoc, serverTimestamp, toDate, limit, updateDoc, onSnapshot, Timestamp, startAfter, } from "firebase/firestore";



export const NewRTCA = ({ firebaseApp }) => {

  const db = getFirestore(firebaseApp);
  const dispatch = useDispatch()


  const [searchedUserList, setSearchedUserList] = useState() // queries user list
  const [selectedUserToChat, setSelectedUserToChat] = useState()
  const [connectionHeader, setConnectionHeader] = useState(true)
  const [connectionsToShow, setConnectionsToShow] = useState([]);//connection request list to show


  const currentUser = useSelector(state => state.user.currentUser)
  const userData = useSelector(state => state.user.userInfo) // user info like connection list, email
  const usersList = useSelector(state => state.user.usersList); // all the existing users in the db

  console.log('===============================================================================')
  // console.log('currentUser', currentUser)
  // console.log('connectionsToShow-', connectionsToShow)


  useEffect(() => {

    //getting all users (have to move it somewhere where it wont run on every stsate chnages, as its calling db on every state changes decreasing the reads per day... add in usememo, usecallback)
    getAllUsersList()

  }, [])

  useEffect(() => {
    async function fetchData() {
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
      // if (selectedUserToChat) retrieveTexts(selectedUserToChat) //added bcz without this onsnapshot wont work  // commented for issue #1
    }
  }, [userData])



  //getting alluser may not be needed,, just query the user when user search,,...its only needed bcz of avatar,,we have only stored username in the connecction list,,if we can also store the image than this willbe not needed at all... and if its still needed than create a snapshot at the topmost level so that it wont be trigggered in any case,, also cache this and this will only run when a new user is created(snapshot will handle that)...
  async function getAllUsersList() {

    dispatch({ type: SET_USERS_LIST, payload: dbUsers })

    //commented for testing 
    // await getDocs(collection(db, "users"))
    // .then((querySnapshot) => {
    //   let userList={};
    //   querySnapshot.docs
    //     .map((doc) => {
    //       let data= doc.data();
    //       data.id=doc.id;
    //       // console.log('dddddd',data)
    //       userList[data.username] = data;
    //     });
    //     console.log('111sna',userList)
    // dispatch({ type: SET_USERS_LIST, payload: userList })
    //   })
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
      //   // newMessages.push(doc.data());// to show message preview (last msg)
      // });

      const hasNewMessages = querySnapshot.size > 0;
      return hasNewMessages;

    } else {
      return true;
    }
  }


  function handleSelectedUserToChat(username) {
    //dispatch an event and set the state there (may or may not be required)
    sidebarVisibility(false, setSearchedUserList)//closing sidebar
    setSelectedUserToChat(username);//setting selected user

    // retrieveTexts(username);// it will be in useefct in chatbox compo and whenever selectedUsertoChat is changed than it will run this function
  }


  async function clearChat(id) {

    //connection is moved to req list after deleting msgs
    console.log('clearChat', id)
    if (userData?.connections?.hasOwnProperty(id)) {

      // let connectionId = userData.connections[id]?.id;
      userData.connections[id].deletedTill = serverTimestamp();

      //deleting connection req from req list 
      const docRef = doc(db, "users", userData?.id);
      await updateDoc(docRef, {
        connections: userData.connections,
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


  return (
    <>
      <div className="outer">

        {/***** SIDEBAR STARTS ******/}
        <Sidebar
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
                <img src={usersList[selectedUserToChat]?.avatar} className="chatWithProfile ms-1" type="button" data-bs-toggle="dropdown" aria-expanded="false" alt="" />
                {userData?.connections.hasOwnProperty(selectedUserToChat) &&
                  <ul className="dropdown-menu p-2">
                    <li className="dropdown-item pointer" onClick={() => clearChat(selectedUserToChat)}>Clear chats</li>
                    <li className="dropdown-item pointer" onClick={() => blockConnection(db, userData, selectedUserToChat, setSelectedUserToChat)}>Block connection</li>
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

              {/* just to check total requests */}
              {userData?.requests && Object.keys(userData?.requests)?.length}-
              {connectionHeader ? <UserPlus2 size={15} /> : <span className="me-1">Connection Requests</span>}

              {connectionsToShow?.length > 0 &&
                <span className="req_badge">
                  {connectionsToShow.length}
                </span>}
            </section>
          </div>
        }

        {/***** CHAT HEADER ENDS ******/}


        {/***** CHAT BODY STARTS ******/}
        {selectedUserToChat ?
          <ChatBox
            firebaseApp={firebaseApp}
            selectedUserToChat={selectedUserToChat}
            setSelectedUserToChat={setSelectedUserToChat}
          />
          :
          connectionHeader ?
            // can be converted to a component
            (userData?.connections ?
              Object.keys(userData?.connections)?.length > 0 ?

                <div className="chat_list">{
                  Object.keys(userData?.connections).map((x, i) => {
                    return (
                      <div className="list" key={i}>
                        <section className="chat_list_item" onClick={() => handleSelectedUserToChat(x)} >
                          <img src={usersList[x]?.avatar} className="me-2" alt="" />
                          <span>{x}</span>
                        </section>
                        <section className="deleteConnection" onClick={() => deleteConnection(x)} title="Delete connection">
                          {/* <Trash size={18} /> */}
                          <UserRoundX size={18} />
                        </section>
                        <section className="blockConnection" onClick={() => blockConnection(db, userData, x, setSelectedUserToChat)} title="Block connection">
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
                        <img src={usersList[uName]?.avatar} className="me-2" alt="" />
                        <span>{uName}</span>
                      </section>
                      <section className="acceptReq" onClick={() => acceptConnectionReq(db, userData, uName)} title="Accept connection">
                        <UserCheck2 size={18} />
                      </section>
                      <section className="declineReq" onClick={() => declineConnectionReq(db, userData, uName, setSelectedUserToChat)} title="Decline connection">
                        {/* <Trash size={18} /> */}
                        <UserRoundX size={18} />
                      </section>
                      <section className="blockReq" onClick={() => blockConnection(db, userData, uName, setSelectedUserToChat)} title="Block connection">
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
