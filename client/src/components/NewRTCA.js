import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from 'react-redux'


import hamburger from "./../assets/menu.png";
import Sidebar from "./Sidebar";
import ChatBox from "./ChatBox";
import { RESET_USERS_LIST, SET_CURRENT_USER, SET_REQUEST_LIST, SET_SIDEBAR, SET_USERS_LIST, SET_USER_INFO } from "../redux/actionTypes";
import { acceptConnectionReq, blockConnection, dbUsers, debounce, declineConnectionReq, sidebarVisibility, writeToDb, exitGroup, acceptGroupReq } from "../utils";
import { ChevronLeft, LogOut, Send, X, Users, UserPlus2, UserPlus, Users2, Delete, DeleteIcon, Trash, UserRoundX, UserCheck, UserCheck2, UserX, UserX2, Ban, List } from 'lucide-react';


import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, doc, orderBy, getDocs, getDoc, addDoc, setDoc, serverTimestamp, toDate, limit, updateDoc, onSnapshot, Timestamp, startAfter, } from "firebase/firestore";
import Toast from "./Toast";
import EntityInfoModal from "./modals/EntityInfoModal";
import { FirebaseContext } from "../firebaseContext";


export const NewRTCA = () => {

  const { firebaseApp, db } = useContext(FirebaseContext);
  // const db = getFirestore(firebaseApp);  
  const dispatch = useDispatch()


  // const [searchedUserList, setSearchedUserList] = useState() // queries user list
  const [selectedUserToChat, setSelectedUserToChat] = useState()
  // const [selectedGroupToChat, setSelectedGroupToChat] = useState(null)
  const [isGroupSelected, setIsGroupSelected] = useState(false)
  const [selectedGroupName, setSelectedGroupName] = useState(undefined)
  const [connectionHeader, setConnectionHeader] = useState(true)
  const [connectionsToShow, setConnectionsToShow] = useState([]);//connection request list to show

  const [showEntityInfoModal, setShowEntityInfoModal] = useState(false)// controls user/info modal



  const currentUser = useSelector(state => state.user.currentUser)
  const userData = useSelector(state => state.user.userInfo) // user info like connection list, email
  const usersList = useSelector(state => state.user.usersList); // all the existing users in the db
  const sidebar = useSelector(state => state.ui.sidebar);

  console.log('===============================================================================userData', userData)
  // console.log('currentUser', currentUser)
  // console.log('connectionsToShow-', connectionsToShow)


  //NOTE:: try merging these two useeffects..Also try to optimize getAllUsersList function
  useEffect(() => {

    // getAllUsersList()// using snapshot instead
    dispatch({ type: SET_USERS_LIST, payload: dbUsers });
    //commented for testing
    // const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
    //   console.log('+++++++++++++++++++++getAllUsersList',snapshot)
    //   let userList = {};
    //   snapshot.docs.forEach((doc) => {
    //     // let data = {...doc.data(),id:doc.id};
    //     userList[doc.data()?.username] = {...doc.data(),id:doc.id};
    //   });
    //   console.log('ul',userList)
    //   dispatch({ type: SET_USERS_LIST, payload: userList });
    // });

    // return () => unsubscribe();
  }, [])

  useEffect(() => {
    //setting connection req list
    if (userData) {
      console.log('calling fetchData')
      fetchData();
      // if (selectedUserToChat) retrieveTexts(selectedUserToChat) //added bcz without this onsnapshot wont work  // commented for issue #1
    }
  }, [userData, connectionHeader])// feetching req list whenever userData changes and connection header is toggled

  async function fetchData() {
    // this function filters the requests which are recent(fresh ones and the one which has new msgs after deleted earlier)
    const connections = [];
    if (Object.keys(userData?.requests)) {
      for (const uName of Object.keys(userData?.requests)) {
        const hasNewMessages = await getConnectionRequests(uName);
        if (hasNewMessages) {
          connections.push(userData?.requests[uName].groupName ? userData?.requests[uName] : uName);// only put the entire request object if its a group otherwise just the name
        }
      }
    }
    setConnectionsToShow(connections);
    dispatch({ type: SET_REQUEST_LIST, payload: connections })
  };

  // removed this and appened the logic in above useefect where fetchData was called (updated depenedency array with connectionHeader)
  // useEffect(() => {
  //   if (!connectionHeader) fetchData(); // to load the request list when requests window is opened
  // }, [connectionHeader])

  console.log('connextions sto show', connectionsToShow)



  //getting alluser may not be needed,, just query the user when user search,,...its only needed bcz of avatar,,we have only stored username in the connecction list,,if we can also store the image than this willbe not needed at all... and if its still needed than create a snapshot at the topmost level so that it wont be trigggered in any case,, also cache this and this will only run when a new user is created(snapshot will handle that)...
  async function getAllUsersList() {
    console.log('+++++++++++++++++++++getAllUsersList')

    // dispatch({ type: SET_USERS_LIST, payload: dbUsers })

    // commented for testing 
    // await getDocs(collection(db, "users"))
    // .then((querySnapshot) => {
    //   let userList={};
    //   querySnapshot.docs
    //     .map((doc) => {
    //       let data= doc.data();
    //       data.id=doc.id;
    //       userList[data.username] = data;
    //     });
    //     console.log('dddddd',userList)
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

  // NOTE:: CHNAGE the state selectedUserToChat to selectedEntityToChat.. this will represent both groups and individual user, this way we wont need selectedGroupToChat too, instead there will be a flag isGroupSelected,, this will tell if selected entity is a group or not

  function handleSelectedUserToChat(username, groupName) {
    //dispatch an event and set the state there (may or may not be required)
    // sidebarVisibility(false, setSearchedUserList)//closing sidebar
    // sidebarVisibility(false)//closing sidebar
    dispatch({ type: SET_SIDEBAR, payload: false })
    dispatch({ type: RESET_USERS_LIST, payload: true })//clearing all records of search list
    setSelectedUserToChat(username);//setting selected user

    console.log('handleSelectedUserToChat  clicked', username, groupName)
    if (groupName) {
      setIsGroupSelected(true);
      setSelectedGroupName(groupName)
    }

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
      setIsGroupSelected(false)
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
      setIsGroupSelected(false)
    }
  }



  return (
    <>
      <div className="outer-top">
        <div className="outer">

          {/***** SIDEBAR STARTS ******/}
          {/* maybe add a boolean to check if sidebar is visible,, only than show sidebar,, this will prevent unnecessary rerender of sidebar even when its not in use */}
          {sidebar &&
            <>
              <Sidebar
                // searchedUserList={searchedUserList}
                // setSearchedUserList={setSearchedUserList}
                handleSelectedUserToChat={handleSelectedUserToChat}
              />
              <div className="overlay pointer" onClick={() => { dispatch({ type: SET_SIDEBAR, payload: false }); dispatch({ type: RESET_USERS_LIST, payload: true }) }}></div>
            </>
          }
          {/***** SIDEBAR ENDS ******/}


          {/***** CHAT HEADER STARTS ******/}
          <div className="chat-head zIndex2">
            <div className="hamburger" onClick={() => { dispatch({ type: SET_SIDEBAR, payload: true }); dispatch({ type: RESET_USERS_LIST, payload: false }) }}>
              <img src={hamburger} alt="." />
            </div>
            {selectedUserToChat &&
              <div className="d-flex align-items-center">
                <ChevronLeft className="pointer" onClick={() => { setSelectedUserToChat(undefined); setIsGroupSelected(false) }} />
                <section id="chatWith">{isGroupSelected ? selectedGroupName : selectedUserToChat}</section>

                <div className="dropdown">
                  <span className="position-relative cwp" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {isGroupSelected ?
                      <span className="chatWithProfile ms-1" >
                        <Users size={18} />
                      </span>
                      :
                      <img src={usersList[selectedUserToChat]?.avatar} className="chatWithProfile ms-1" alt="" />
                    }
                    {userData?.connections.hasOwnProperty(selectedUserToChat) &&
                      <span className="list-icon">
                        <List size={18} />
                      </span>
                    }
                  </span>
                  {userData?.connections.hasOwnProperty(selectedUserToChat) &&
                    <ul className="dropdown-menu p-2">
                      <li className="dropdown-item pointer" onClick={() => clearChat(selectedUserToChat)}>Clear chat</li>
                      {/* {userData?.connections[selectedUserToChat]?.hasOwnProperty('exitAt') ?
                        <li className="dropdown-item pointer" onClick={() => deleteConnection(selectedUserToChat)}>
                          Delete Group
                        </li>
                        : */}
                      <li className="dropdown-item pointer" onClick={() => isGroupSelected ? exitGroup(db, userData, selectedUserToChat, setSelectedUserToChat, false) : deleteConnection(selectedUserToChat)}>
                        {isGroupSelected ? 'Exit Group' : 'Remove connection'}
                      </li>
                      {/* } */}
                      {isGroupSelected ?
                        <li className="dropdown-item pointer" onClick={() => setShowEntityInfoModal(true)}>Group info</li>
                        :
                        <li className="dropdown-item pointer" onClick={() => blockConnection(db, userData, selectedUserToChat, setSelectedUserToChat)}>Block connection</li>
                      }
                    </ul>
                  }
                </div>

              </div>
            }
          </div>

          {/* connection/request button */}
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



          {/***** NEW HEADER START ******/}
          {/* <label htmlFor="filter" className="switch" aria-label="Toggle Filter" onClick={() => setConnectionHeader(prev => !prev)}>
            <input type="checkbox" id="filter" />
            <span>C</span>
            <span>R</span>
          </label> */}
          {/***** NEW HEADER ENDS ******/}


          {/***** CHAT BODY STARTS ******/}
          {selectedUserToChat ?
            <ChatBox
              // firebaseApp={firebaseApp}
              selectedUserToChat={selectedUserToChat}
              setSelectedUserToChat={setSelectedUserToChat}
              isGroupSelected={isGroupSelected}
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
                          <section className="chat_list_item" onClick={() => handleSelectedUserToChat(x, userData?.connections[x]?.groupName || false)} >
                            {userData?.connections[x].groupName ?
                              <span className="me-2 groupIcon" >
                                <Users size={18} />
                              </span>
                              :
                              <img src={usersList[x]?.avatar} className="me-2" alt="" />
                            }
                            <span>{userData?.connections[x].groupName || x}</span>
                          </section>

                          {/* ACTIONS */}
                          {userData?.connections[x]?.groupName ?
                            // (userData?.connections[x].hasOwnProperty('exitAt') ?
                            //   <section className="blockConnection" onClick={() => deleteConnection(x)} title="Delete group">
                            //     <Trash size={18} /> 
                            //   </section>
                            //   :
                            <section className="blockConnection" onClick={() => exitGroup(db, userData, x, setSelectedUserToChat, false, false)} title="Exit group">
                              <LogOut size={18} />
                            </section>
                            // )
                            :
                            <>
                              <section className="deleteConnection" onClick={() => deleteConnection(x)} title="Delete connection">
                                {/* <Trash size={18} /> */}
                                <UserRoundX size={18} />
                              </section>
                              <section className="blockConnection" onClick={() => blockConnection(db, userData, x, setSelectedUserToChat)} title="Block connection">
                                {/* <UserRoundX size={18} /> */}
                                <Ban size={18} />
                              </section>
                            </>
                          }
                        </div>
                      )
                    })}
                  </div>
                  :
                  <div className="noOneToChat">
                    <section>Add/search friends to start a chat or start a group</section>
                  </div>
                :
                <div className="noOneToChat">fetching connections...</div>)
              :
              (userData?.requests ?
                Object.keys(userData?.requests)?.length > 0 ?

                  <div className="request_list">
                    {connectionsToShow.map((uName, i) => {
                      // uname has just the username for one to one connection,, but it is an object for groups
                      let id = uName?.id || uName;
                      return (
                        <div className="list" key={i}>
                          <section key={i} className="request_list_item" onClick={() => handleSelectedUserToChat(id, uName?.groupName || false)}>
                            {uName?.groupName ?
                              <span className="me-2 groupIcon" >
                                <Users size={18} />
                              </span>
                              :
                              <img src={usersList[uName]?.avatar} className="me-2" alt="" />
                            }
                            <span>{uName?.groupName || uName}</span>
                          </section>

                          {/* ACTIONS */}
                          <section className={`acceptReq ${uName?.groupName && ' overrideClrGreen'}`} onClick={() =>
                            uName?.groupName ? acceptGroupReq(db, userData, id) : acceptConnectionReq(db, userData, id, dispatch)} title="Accept connection">
                            <UserCheck2 size={18} />
                          </section>
                          {uName?.groupName ?
                            <section className={`declineReq overrideClrRed`} onClick={() => exitGroup(db, userData, id, setSelectedUserToChat, false)} title="Decline & exit group">
                              <UserRoundX size={18} />
                            </section>
                            :
                            <section className={`blockReq declineReq`} onClick={() => declineConnectionReq(db, userData, id, setSelectedUserToChat)} title="Decline connection">
                              {/* <Trash size={18} /> */}
                              <UserRoundX size={18} />
                            </section>
                          }
                          {!uName?.groupName &&
                            <section className="blockReq" onClick={() => blockConnection(db, userData, id, setSelectedUserToChat)} title="Block connection">
                              {/* <UserRoundX size={18} /> */}
                              <Ban size={18} />
                            </section>
                          }
                        </div>
                      )
                    }
                    )}
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


          {/* <div className="overlay pointer d-none" onClick={() => { dispatch({ type: SET_SIDEBAR, payload: false }); dispatch({ type: RESET_USERS_LIST, payload: true }) }}></div> */}

          {showEntityInfoModal &&
            <>
              <EntityInfoModal
                setShowEntityInfoModal={setShowEntityInfoModal}
                selectedUserToChat={selectedUserToChat}
                selectedGroupName={selectedGroupName}
              // searchedUserList={searchedUserList}
              // setSearchedUserList={setSearchedUserList}
              />
              <div className="overlay pointer zIndex4" onClick={() => setShowEntityInfoModal(false)}></div>
            </>
          }

        </div>
        <Toast />
      </div>
    </>
  )
}
