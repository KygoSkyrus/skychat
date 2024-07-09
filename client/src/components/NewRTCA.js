import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { ChevronLeft, LogOut, Users, UserRoundX, UserCheck2, Ban, List, Info } from 'lucide-react';
import { collection, query, where, doc, orderBy, getDocs, serverTimestamp, limit, updateDoc } from "firebase/firestore";

import hamburger from "./../assets/menu.png";
import Loader from "./Loader";
import Sidebar from "./Sidebar";
import ChatBox from "./ChatBox";
import EntityInfoModal from "./modals/EntityInfoModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import { FirebaseContext } from "../firebaseContext";
import { RESET_USERS_LIST, SET_REQUEST_LIST } from "../redux/actionTypes";
import { showConfirmationModal, showEntityInfoModal, showLoader, showSidebar } from "../redux/actionCreators";
import { acceptConnectionReq, blockConnection, declineConnectionReq, exitGroup, acceptGroupReq } from "../utils";


const NewRTCA = () => {

  const dispatch = useDispatch()
  const { db } = useContext(FirebaseContext);
  const [selectedUserToChat, setSelectedUserToChat] = useState()
  const [isGroupSelected, setIsGroupSelected] = useState(false)
  const [selectedGroupName, setSelectedGroupName] = useState(undefined)
  const [connectionHeader, setConnectionHeader] = useState(true)
  const [connectionsToShow, setConnectionsToShow] = useState([]); // request list to show

  const userData = useSelector(state => state.user.userInfo) // user info like connection list, email
  const usersList = useSelector(state => state.user.usersList); // all the existing users in the db
  const isEntityInfoModalVisible = useSelector((state) => state.ui.isEntityInfoModalVisible);

  useEffect(() => {
    if (userData) fetchData();
  }, [userData, connectionHeader]) // fetching req list whenever userData changes and connection header is toggled

  async function fetchData() {
    // this function filters the requests which are recent(fresh ones and the one which has new msgs after deleted earlier)
    const connections = [];
    const ids = [];
    if (Object.keys(userData?.requests)) {
      for (const uName of Object.keys(userData?.requests)) {
        const hasNewMessages = await getConnectionRequests(uName);
        if (hasNewMessages) {
          connections.push(userData?.requests[uName]?.groupName ? userData?.requests[uName] : uName); // only put the entire request object if its a group otherwise just the name
          ids.push(uName); // for chatbox to hide show the chat input field
        }
      }
    }
    setConnectionsToShow(connections);
    dispatch({ type: SET_REQUEST_LIST, payload: ids })
  };

  async function getConnectionRequests(uName, i) {

    let connectionId = userData?.requests?.[uName]?.id;
    let deletedTill = userData?.requests?.[uName]?.deletedTill;

    if (deletedTill) {
      let q = query(collection(db, "v2"), where("connectionId", "==", connectionId), where("time", ">", deletedTill), orderBy("time", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      const hasNewMessages = querySnapshot.size > 0;
      return hasNewMessages;
    } else {
      return true;
    }
  }

  function handleSelectedUserToChat(username, groupName) {
    dispatch(showSidebar(false))
    dispatch({ type: RESET_USERS_LIST, payload: true }); // clearing all search list records
    setSelectedUserToChat(username);
    if (groupName) {
      setIsGroupSelected(true)
      setSelectedGroupName(groupName)
    } else {
      setIsGroupSelected(false)
      setSelectedGroupName(undefined)
    }
  }

  async function clearChat(id) {
    if (userData?.connections?.hasOwnProperty(id)) {
      dispatch(showLoader(true));
      userData.connections[id].deletedTill = serverTimestamp();

      const docRef = doc(db, "users", userData?.id);
      await updateDoc(docRef, {
        connections: userData.connections,
      });

      setSelectedUserToChat(undefined)
      setIsGroupSelected(false)
      dispatch(showLoader(false));
    }
  }

  async function deleteConnection(id) {
    if (userData?.connections?.hasOwnProperty(id)) {
      dispatch(showLoader(true));
      let connectionId = userData.connections[id]?.id;
      delete userData.connections[id];

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
      dispatch(showLoader(false));
    }
  }

  return (
    <>
      <div className="outer-top">
        <div className="outer">

          <Sidebar handleSelectedUserToChat={handleSelectedUserToChat} />

          {/***** CHAT HEADER STARTS ******/}
          <div className="chat-head zIndex2">
            <div className="hamburger" onClick={() => { dispatch(showSidebar(true)); dispatch({ type: RESET_USERS_LIST, payload: false }) }}>
              <img src={hamburger} alt="." />
            </div>
            {selectedUserToChat ?
              <div className="d-flex align-items-center">
                <ChevronLeft className="pointer" onClick={() => { setSelectedUserToChat(undefined); setIsGroupSelected(false) }} />
                <section id="chatWith">{isGroupSelected ? selectedGroupName : selectedUserToChat}</section>

                <div className="dropdown d-flex">
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
                      <li className="dropdown-item pointer" onClick={() => dispatch(showConfirmationModal(`Do you want to clear this chat?`, () => clearChat(selectedUserToChat)))}>Clear chat</li>
                      {isGroupSelected ?
                        <>
                          <li className="dropdown-item pointer" onClick={() => dispatch(showConfirmationModal(`Are you sure you want to exit this group <code>${selectedGroupName}</code>?`, () => exitGroup(dispatch, db, userData, selectedUserToChat, setSelectedUserToChat, false)))}>Exit Group</li>
                          <li className="dropdown-item pointer" onClick={() => dispatch(showEntityInfoModal(true))}>Group info</li>
                        </>
                        :
                        <>
                          <li className="dropdown-item pointer" onClick={() => dispatch(showConfirmationModal(`Are you sure you want to delete connection with <code>${selectedUserToChat}</code>?`, () => deleteConnection(selectedUserToChat)))}>Delete connection</li>
                          <li className="dropdown-item pointer" onClick={() => dispatch(showConfirmationModal(`Are you sure you want to block <code>${selectedUserToChat}</code>?`, () => blockConnection(db, userData, selectedUserToChat, setSelectedUserToChat, dispatch)))}>Block connection</li>
                        </>
                      }
                    </ul>
                  }
                </div>

              </div>
              :
              <div className="sc"><b>SKYCHAT</b></div>
            }
          </div>

          {/* connection/request button */}
          {!selectedUserToChat &&
            <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
              <input type="checkbox" id="filter" />
              <span onClick={() => setConnectionHeader(true)} >Connections</span>
              <span onClick={() => setConnectionHeader(false)} className="d-flex align-items-center">Requests
                {/* just to check total requests */}
                {/* {userData?.requests && Object.keys(userData?.requests)?.length}- */}
                {connectionsToShow?.length > 0 &&
                  <span className="req_badge">
                    {connectionsToShow.length}
                  </span>}
              </span>
            </label>
          }
          {/***** CHAT HEADER ENDS ******/}


          {/***** CHAT BODY STARTS ******/}
          {selectedUserToChat ?
            <ChatBox
              selectedUserToChat={selectedUserToChat}
              setSelectedUserToChat={setSelectedUserToChat}
              isGroupSelected={isGroupSelected}
            />
            :
            connectionHeader ?
              (userData?.connections ?
                Object.keys(userData?.connections)?.length > 0 ?
                  <div className="chat_list">{
                    Object.keys(userData?.connections).map((x, i) => {
                      return (
                        <div className="list" key={i}>
                          <section className="chat_list_item" onClick={() => handleSelectedUserToChat(x, userData?.connections[x]?.groupName || false)} >
                            {userData?.connections[x]?.groupName ?
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
                            <section className="blockConnection" onClick={() => dispatch(showConfirmationModal(`Are you sure you want to exit group <code>${userData?.connections[x].groupName}</code>?`, () => exitGroup(dispatch, db, userData, x, false, false)))} title="Exit group">
                              <LogOut size={18} />
                            </section>
                            :
                            <>
                              <section className="deleteConnection" onClick={() => dispatch(showConfirmationModal(`Are you sure you want to delete connection with <code>${x}</code>?`, () => deleteConnection(x)))} title="Delete connection">
                                <UserRoundX size={18} />
                              </section>
                              <section className="blockConnection" onClick={() => dispatch(showConfirmationModal(`Are you sure you want to block <code>${x}</code>?`, () => blockConnection(db, userData, x, setSelectedUserToChat, dispatch)))} title="Block connection">
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
                    {connectionsToShow?.map((uName, i) => {
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
                            uName?.groupName ? acceptGroupReq(db, userData, id, dispatch) : acceptConnectionReq(db, userData, id, dispatch)} title="Accept connection">
                            <UserCheck2 size={18} />
                          </section>
                          {uName?.groupName ?
                            <section className="declineReq overrideClrRed" onClick={() => dispatch(showConfirmationModal(`Are you sure you want to exit group <code>${uName?.groupName}</code>?`, () => exitGroup(dispatch, db, userData, id, false, false)))} title="Decline & exit group">
                              <UserRoundX size={18} />
                            </section>
                            :
                            <>
                              <section className="blockReq declineReq" onClick={() => dispatch(showConfirmationModal(`Are you sure you want to decline this connection request?`, () => declineConnectionReq(db, userData, id, setSelectedUserToChat, dispatch)))} title="Decline connection">
                                <UserRoundX size={18} />
                              </section>
                              <section className="blockReq" onClick={() => dispatch(showConfirmationModal(`Are you sure you want to block <code>${uName}</code>?`, () => blockConnection(db, userData, id, setSelectedUserToChat, dispatch)))} title="Block connection">
                                <Ban size={18} />
                              </section>
                            </>
                          }
                        </div>
                      )
                    }
                    )}
                  </div>
                  :
                  <div className="noOneToChat">
                    <section>No new connection request</section>
                  </div>
                :
                <div className="noOneToChat">Loading...</div>)
          }
          {/***** CHAT BODY ENDS ******/}


          {/* only needed for group */}
          {isEntityInfoModalVisible &&
            <>
              <EntityInfoModal
                selectedUserToChat={selectedUserToChat}
                selectedGroupName={selectedGroupName}
              />
              <div className="overlay pointer zIndex4" onClick={() => dispatch(showEntityInfoModal(false))}></div>
            </>
          }

          <ConfirmationModal />

        </div>
        <Loader />
      </div>

      <Link to={'/about'} className="info">
        <Info />
      </Link>

      <section className="copyright fs-12">© 2024 All Rights Reserved, Skychat <i className="">by</i> Dheeraj Gupta</section>
    </>
  )
}

export default NewRTCA