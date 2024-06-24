import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import MessageWrapper from './MessageWrapper';
import notification from "./../assets/discord.mp3";
import { acceptConnectionReq, blockConnection, declineConnectionReq, getLocalDateStr, populateConnectionId, writeToDb, exitGroup, acceptGroupReq, getNotification, getFormattedNotification } from '../utils';

import { PlusSquare, Send, Smile, SmilePlus } from 'lucide-react';
import { getFirestore, collection, query, where, doc, orderBy, getDocs, getDoc, addDoc, setDoc, serverTimestamp, toDate, limit, updateDoc, onSnapshot, Timestamp, startAfter } from "firebase/firestore";
import { FirebaseContext } from '../firebaseContext';

import EmojiPicker from 'emoji-picker-react';



const ChatBox = ({ selectedUserToChat, setSelectedUserToChat, isGroupSelected }) => {
    let prevDate = '';

    // const db = getFirestore(firebaseApp);
    const { db } = useContext(FirebaseContext);

    const dummy = useRef(); // responsible to scroll into view whenever msgs are recieved/sent
    const chatBoxRef = useRef(null);
    const inputRef = useRef(null); // ref to input field
    const lastVisible = useRef(null); //reference to the last loaded text

    const [loading, setLoading] = useState(false);
    // const [currentText, setcurrentText] = useState('') // currently typed text
    const [messageList, setMessageList] = useState([]) //messages with the current user

    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser)
    const userData = useSelector(state => state.user.userInfo) // user info like connection list, email
    const requestList = useSelector(state => state.user.requestList)// has request list connections (connections to show)
    const appliedTheme = useSelector(state => state.user.theme)

    console.log('rrrrrrrrrrr', requestList, requestList[selectedUserToChat])

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        if (selectedUserToChat) {
            console.log('useEffect in chatbox--', selectedUserToChat)

            realtimeListener(selectedUserToChat)
            retrieveTexts(selectedUserToChat);
        }

        document.getElementById('theText')?.focus();// focus on input field
    }, [selectedUserToChat])

    useEffect(() => {
        // setting theme
        const theme = localStorage.getItem('theme') || 'https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/patterns%2Fpattern%20(36).jpg?alt=media&token=66fa6c1d-4de8-4d33-8824-71095a0c8a4d';
        chatBoxRef.current.style.backgroundImage = `url('${theme}')`;
    }, [appliedTheme])

    // NOTE: [resolved (now also checking if the opened connection was a group, only then  proceed)]THIS is closing the chatbox whenever i searches for new user to chat
    // added to handle closing of group chat window when user is removed 
    useEffect(() => {
        console.log('new useefect')
        if (!userData?.connections?.hasOwnProperty(selectedUserToChat) && !userData?.requests?.hasOwnProperty(selectedUserToChat) && isGroupSelected) {
            console.log('iffff')
            setSelectedUserToChat(undefined);
        }
    }, [userData])


    function getConnectionId(userName) {
        //checking if the user in connection list or request list
        if (userData?.connections?.hasOwnProperty(userName)) {
            return populateConnectionId(userData.connections[userName])
        } else if (userData?.requests?.hasOwnProperty(userName)) {
            return populateConnectionId(userData.requests[userName])
        } else {
            return populateConnectionId(null)
        }
    }

    function notify(text, delay) {

        let notificationElement = document.createElement('div')
        notificationElement.innerHTML = text;
        notificationElement.classList.add('nothing_to_load')

        let section = document.createElement('section')
        section.classList.add('msg-arrow')
        notificationElement.appendChild(section)

        chatBoxRef.current.insertBefore(notificationElement, chatBoxRef.current.firstChild);

        setTimeout(() => {
            notificationElement.remove()
        }, delay);
    }


    async function retrieveTexts(userToChat, loadMoreTexts = false) {
        console.log('__retrieveTexts', userData, userToChat)
        const { connectionId, chatsTill, exitAt } = getConnectionId(userToChat)
        getTexts(connectionId, chatsTill, exitAt)
    }

    async function getTexts(connectionId, chatsTill, exitAt) {
        console.log('__gettexts', connectionId, selectedUserToChat, userData, chatsTill)

        if (connectionId) {

            const newMessages = [];
            const messagesRef = collection(db, 'v2');
            let queryRef = query(messagesRef, where("connectionId", "==", connectionId), orderBy("time", "desc"), limit(10));

            //msgs after deleted chats only
            if (chatsTill) {
                queryRef = query(messagesRef, where("connectionId", "==", connectionId), where("time", ">", chatsTill), orderBy("time", "desc"), limit(10));
            }

            //msgs before exiting group only
            if (exitAt) {
                queryRef = query(messagesRef, where("connectionId", "==", connectionId), where("time", "<", exitAt), orderBy("time", "desc"), limit(10));
            }

            if (lastVisible.current) {
                // console.log('lastVisible.current', lastVisible.current)
                queryRef = query(messagesRef, where("connectionId", "==", connectionId), orderBy("time", "desc"), startAfter(lastVisible.current), limit(10));

                //to prevent loading msgs before chatsTill
                if (chatsTill) {
                    queryRef = query(messagesRef, where("connectionId", "==", connectionId), where("time", ">", chatsTill), orderBy("time", "desc"), startAfter(lastVisible.current), limit(10));
                }
            }

            const querySnapshot = await getDocs(queryRef);
            querySnapshot.forEach((doc) => {
                let theMsg = { id: doc.id, ...doc.data() }
                newMessages.push(theMsg);
            });

            if (newMessages.length === 0) {
                notify('no previous messages', 2000);
            } else {

                newMessages.reverse()
                setMessageList((prevMessages) => [...newMessages, ...prevMessages]);

                // if(!loadMoreTexts){
                dummy.current?.scrollIntoView({ behaviour: 'smooth' })//maybe just runn it on snapshot
                // }

                // Update the reference to the last visible document(for loading more texts)
                const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
                lastVisible.current = lastDoc;
            }

        } else {
            setMessageList([])
        }
    }

    let isRealTimeUpdate = true;
    function realtimeListener(selectedUser, id) {
        console.log('isRealtimeListener running')

        isRealTimeUpdate = false;

        let cId; // connection ID
        if (id) {
            cId = id;
        } else {
            const { connectionId, chatsTill } = getConnectionId(selectedUser)
            cId = connectionId;
        }

        console.log('__realtimeListener--g-g-g- isRealTimeUpdate', selectedUser, isRealTimeUpdate)
        if (cId) {

            const messagesRef = collection(db, 'v2');


            // NOTE:::: THIS ISSUE [2] is happenong bcz for a new chat,, the connection id is created on send text,, and maybe this snapshot does not has connection id,s o maybe thats why its is needed to be refreshed in order to have  a connection id

            let queryRef = query(messagesRef, where("connectionId", "==", cId), orderBy("time", "desc"), limit(1));
            //chatsTill may not be needed as its real-time

            onSnapshot(queryRef, (snapshot) => {

                let newMessage = {};
                snapshot.forEach((doc) => {
                    newMessage = { id: doc.id, ...doc.data() }
                });

                //only updates when the onsnapshot is triggered oragnically and not by useEffct (only code inside onSnapshot block will run)
                if (isRealTimeUpdate) {
                    console.log('isRealTimeUpdate ---newMessage', snapshot, newMessage)

                    // setMessageList((prevArray) => {
                    //     const isDuplicate = prevArray.some((existingObject) => existingObject.id === newMessage.id);
                    //     if (snapshot.metadata.hasPendingWrites) { //(tells if the doc has been written at server)
                    //         const time = new Date().toISOString()
                    //         newMessage.time = time;
                    //     }
                    //     return isDuplicate ? prevArray : [...prevArray, newMessage];
                    // })
                    // updated to get realtime update for deleted msgs
                    setMessageList((prevArray) => {
                        const isDuplicate = prevArray.some((existingObject) => existingObject.id === newMessage.id);
                        if (snapshot.metadata.hasPendingWrites) { //(tells if the doc has been written at server)
                            const time = new Date().toISOString()
                            newMessage.time = time;
                        }
                        return isDuplicate ? prevArray : [...prevArray, newMessage];
                    })

                    // only play this audio when msg is from other user, dont play it for yourself
                    if (newMessage?.author !== userData.username) {
                        const audio = new Audio(notification);
                        audio.play(); // this is playing twice [fixed]
                    }

                    // Update the reference to the last visible document(for loading more texts, [when there is new message after chats deleted])
                    if (!lastVisible.current) {
                        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
                        lastVisible.current = lastDoc;
                    }

                    dummy.current?.scrollIntoView({ behaviour: 'smooth' })//maybe just runn it on snapshot
                }

                isRealTimeUpdate = true;
            })

        }
    }


    //when messages are loaded than cache all the msgs so that when user opens that chat again , all those msgs will be displayed and he wont have to load them again n again, 
    const loadMoreTexts = async (target) => {
        setLoading(true);
        const { scrollHeight } = target;
        const prevheight = scrollHeight;

        try {
            retrieveTexts(selectedUserToChat, true)
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);

            setTimeout(() => {
                // console.log('scroll back to current position - ', prevheight, chatBoxRef.current.scrollHeight)
                chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight - prevheight
            }, 500);
        }
    };

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        // Checks if the user has scrolled to the top
        if (scrollTop === 0 && !loading && messageList.length > 0) {
            loadMoreTexts(e.target);
        }
    };

    const showChatDate = (currDate) => {
        if (prevDate !== currDate) {
            prevDate = currDate;
            return true;
        }
        return false;
    }

    async function sendText() {
        if (inputRef?.current?.value !== "") {
            let connectionId;

            // check if userdata has the connection already and if not than add the connection in user collection
            if (userData?.connections?.hasOwnProperty(selectedUserToChat)) {
                connectionId = userData?.connections[selectedUserToChat]?.id;
            } else if (userData?.requests?.hasOwnProperty(selectedUserToChat)) {
                connectionId = userData?.requests[selectedUserToChat]?.id;
                // NOTE:::: when a msg is sent and selected user is from request list than it means it is one of the removed connection, so we have to move this connection from req list to connection
                delete userData.requests[selectedUserToChat];
                const userDocRef = doc(db, "users", userData.id);
                await updateDoc(userDocRef, {
                    connections: {
                        ...userData.connections,
                        [selectedUserToChat]: {
                            id: connectionId,
                        },
                    },
                    requests: {
                        ...userData.requests
                    }
                });
            } else {
                connectionId = uuidv4(); // creating a new connection id
                const userDocRef = doc(db, "users", userData.id);
                // updating the user document with new connection in connection list
                // initailly add past time like 1970 in deltedTill
                await updateDoc(userDocRef, {
                    connections: {
                        ...userData.connections,
                        [selectedUserToChat]: {
                            id: connectionId,
                        },
                    }
                });

                // getting receiver's doc
                let receiverDoc;
                let q = query(collection(db, "users"), where("username", "==", selectedUserToChat));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    // console.log("RECIEVEER'S DOC => ", doc.data());
                    receiverDoc = doc.data()
                    receiverDoc.id = doc.id;
                    return;
                });

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

                // calling the realtimeListener for initial msg, bcz for first msg when user is selected to chat up untill then there is no connection id, so onsnapshot does not work when msg is sent and needs a refresh
                if (messageList.length === 0) realtimeListener(selectedUserToChat, connectionId)
            }

            const msgData = {
                connectionId: connectionId,
                author: currentUser.displayName,
                message: inputRef?.current?.value,
                time: serverTimestamp(),
                deletedBy: [],
            };

            writeToDb(db, msgData);
            // setcurrentText(''); // resetting input text field
            inputRef.current.value = '';
        }
    }

    const onEmojiClick = (event) => {
        let sym = event.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        inputRef.current.value += emoji;
    };


    console.log('messageLIST', messageList)


    console.log('------->>>>>>>>-----------chat box ends------------------------')

    return (
        <div className="chat-body" id="chatBody">
            {/* <div className='layer'></div> */}
            <div className="chat-box zIndex1" id="chatBox" onScroll={handleScroll} ref={chatBoxRef} >
                <div className='bg-layer'></div>
                {showEmojiPicker &&
                    <div className="transparent-overlay" onClick={() => setShowEmojiPicker(!showEmojiPicker)}></div>
                }
                {loading &&
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                    // :
                    // <div className="text-center load_more"><span>load more</span></div>
                }

                {
                    messageList?.length > 0 ?
                        messageList?.map((msgData) => {
                            let currDate = getLocalDateStr(msgData?.time);
                            return (
                                <div key={msgData.id} className="d-flex flex-column zIndex1">
                                    {/* show dates */}
                                    {showChatDate(currDate) &&
                                        <div className="text-center date">
                                            <span className="fs-12">{currDate}</span>
                                        </div>
                                    }

                                    {/* show notifications */}
                                    {msgData?.isNotification ?
                                        <div className="text-center date">
                                            <span className="fs-12 px-2" style={{ background: "var(--violet)" }}>
                                                {getFormattedNotification(msgData, userData?.username)}
                                            </span>
                                        </div>
                                        :
                                        // dont show if the msg is deleted by me but i am not its author (for v3)
                                        // (!(msgData?.deletedBy?.includes(userData?.username) && msgData?.author !== userData?.username) && 
                                        <MessageWrapper msgData={msgData} myself={currentUser?.displayName}
                                            isGroupSelected={isGroupSelected} setMessageList={setMessageList} />
                                        // )
                                    }
                                </div>
                            )
                        })
                        :
                        <section className="absolute-centered">No messages yet...</section>
                }
                <div ref={dummy}></div>
            </div>

            {/* {userData?.requests[selectedUserToChat] ? */}
            {requestList?.includes(selectedUserToChat) ?// only show these action for action the reqList conections
                // when request chat is opened
                (<div className="req_btn zIndex1">
                    <section className="enq_btn accept" onClick={() => userData?.requests[selectedUserToChat]?.groupName ? acceptGroupReq(db, userData, selectedUserToChat) : acceptConnectionReq(db, userData, selectedUserToChat, dispatch)} >Accept</section>
                    <div className="d-flex gap-1">
                        {userData?.requests[selectedUserToChat]?.groupName ?
                            <section className="enq_btn delete mt-1" onClick={() => exitGroup(db, userData, selectedUserToChat, setSelectedUserToChat, false)}>Leave group</section>
                            :
                            <>
                                <section className="enq_btn delete mt-1" onClick={() => declineConnectionReq(db, userData, selectedUserToChat, setSelectedUserToChat)}>Delete</section>
                                <section className="enq_btn delete mt-1" onClick={() => blockConnection(db, userData, selectedUserToChat, setSelectedUserToChat)}>Block</section>
                            </>
                        }
                    </div>
                </div>)
                :
                (userData?.connections[selectedUserToChat]?.exitAt ?
                    // when user has left group
                    <div className="p-3 fs-12 text-center zIndex1">You are no longer a member of group</div>
                    :
                    <div className="msg-input form-control border-0 zIndex1">
                        <input
                            type="text"
                            ref={inputRef}
                            name="msg"
                            id="theText"
                            placeholder="...type"
                            className="my-1"
                            onKeyUp={(e) => e.key === "Enter" && sendText()}
                            autoComplete="off"
                        />
                        <span className='emoji-picker pointer' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                            <SmilePlus />
                        </span>
                        <div>
                            <EmojiPicker
                                open={showEmojiPicker}
                                onEmojiClick={onEmojiClick}
                                theme='light'
                                emojiStyle='native'
                                lazyLoadEmojis={true}
                                previewConfig={{
                                    showPreview: false,
                                }}
                            // reactionsDefaultOpen={true}
                            />
                        </div>
                        <button onClick={() => sendText()} className="rounded-2 sendBtn"><Send /></button>
                    </div>
                )
            }
        </div>
    )
}

export default ChatBox