import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import MessageWrapper from './MessageWrapper';
import notification from "./../assets/discord.mp3";
import { acceptConnectionReq, blockConnection, debounce, declineConnectionReq, getLocalDateStr, writeToDb } from '../utils';

import { Send } from 'lucide-react';
import { getFirestore, collection, query, where, doc, orderBy, getDocs, getDoc, addDoc, setDoc, serverTimestamp, toDate, limit, updateDoc, onSnapshot, Timestamp, startAfter, } from "firebase/firestore";


const ChatBox = ({ firebaseApp, selectedUserToChat, setSelectedUserToChat }) => {
    let prevDate = '';

    const db = getFirestore(firebaseApp);

    const dummy = useRef();
    const chatBoxRef = useRef(null);
    const lastVisible = useRef(null);

    const [loading, setLoading] = useState(false);
    const [currentText, setcurrentText] = useState('') // currently typed text
    const [messageList, setMessageList] = useState([]) //messages with the current user

    const currentUser = useSelector(state => state.user.currentUser)
    const userData = useSelector(state => state.user.userInfo) // user info like connection list, email


    useEffect(() => {
        if (selectedUserToChat) {
            console.log('useEffect in chatbox--')

            realtimeListener(selectedUserToChat)
            retrieveTexts(selectedUserToChat);
        }

    }, [selectedUserToChat])



    console.log('messageList->>>>>>>>>>>>>>>>>', messageList)


    function getConnectionId(userName) {
        let connectionId = undefined;
        let chatsTill = null;

        //checking if the user in connection list or request list
        if (userData?.connections?.hasOwnProperty(userName)) {
            populateConnectionId(userData.connections)
        } else if (userData?.requests?.hasOwnProperty(userName)) {
            populateConnectionId(userData.requests)
        }

        function populateConnectionId(obj) {
            connectionId = obj[userName]?.id;
            chatsTill = obj[userName]?.deletedTill;
        }

        return { connectionId, chatsTill };
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
        const { connectionId, chatsTill } = getConnectionId(userToChat)
        getTexts(connectionId, chatsTill, loadMoreTexts)
    }

    async function getTexts(connectionId, chatsTill, loadMoreTexts) {
        console.log('__gettexts', connectionId, selectedUserToChat, userData, chatsTill)

        if (connectionId) {

            const messagesRef = collection(db, 'v2');
            let queryRef = query(messagesRef, where("connectionId", "==", connectionId), orderBy("time", "desc"), limit(2));

            //msgs after deleted chats only
            if (chatsTill) {
                queryRef = query(messagesRef, where("connectionId", "==", connectionId), where("time", ">", chatsTill), orderBy("time", "desc"), limit(2));
            }

            if (lastVisible.current) {
                // console.log('lastVisible.current', lastVisible.current)
                queryRef = query(messagesRef, where("connectionId", "==", connectionId), orderBy("time", "desc"), startAfter(lastVisible.current), limit(2));

                //to prevent loading msgs before chatsTill
                if (chatsTill) {
                    queryRef = query(messagesRef, where("connectionId", "==", connectionId), where("time", ">", chatsTill), orderBy("time", "desc"), startAfter(lastVisible.current), limit(2));
                }
            }

            const querySnapshot = await getDocs(queryRef);

            const newMessages = [];

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


    //when messages are loaded than cache all the msgs so that when user opens taht chat again , all those msgs will be displayed and he wont have to load them again an again, 
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
        // Check if the user has scrolled to the top
        if (scrollTop === 0 && !loading && messageList.length > 0) {
            loadMoreTexts(e.target);
        }
    };



    let isRealTimeUpdate = true;
    function realtimeListener(selectedUser) {
        console.log('__realtimeListener', selectedUser)

        isRealTimeUpdate = false;
        const { connectionId, chatsTill } = getConnectionId(selectedUser)

        if (connectionId) {

            const messagesRef = collection(db, 'v2');

            let queryRef = query(messagesRef, where("connectionId", "==", connectionId), orderBy("time", "desc"), limit(1));
            //chatsTill may not be needed as its real-time

            onSnapshot(queryRef, (snapshot) => {

                let newMessage = {};
                snapshot.forEach((doc) => {
                    newMessage = { id: doc.id, ...doc.data() }
                });

                //only updates when the onsnapshot is triggered oragnically and not by useEffct (only code inside onSnapshot block will run)
                if (isRealTimeUpdate) {
                    console.log('did i run,  --newMessage', snapshot, newMessage)

                    setMessageList((prevArray) => {
                        const isDuplicate = prevArray.some((existingObject) => existingObject.id === newMessage.id);

                        if (snapshot.metadata.hasPendingWrites) { //(tells if the doc has been written at server)
                            // const time = getExactTimeStr(new Date())
                            const time = new Date().toISOString()
                            newMessage.time = time;
                        }


                        return isDuplicate ? prevArray : [...prevArray, newMessage];
                    })

                    // only play this audio when msg is from other user, dont play it for yourself
                    if(newMessage?.author !== userData.username){
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


    const showChatDate = (currDate) => {
        if (prevDate !== currDate) {
            prevDate = currDate;
            return true;
        }
        return false;
    }

    async function sendText() {
        if (currentText !== "") {
            // console.log('currentText', currentText, currentUser.displayName)
            // console.log('current user data', userData)

            let connectionId;

            // check if userdata has the connection already and if not than add the connection in user collection
            if (userData?.connections?.hasOwnProperty(selectedUserToChat)) {
                // console.log('has own property')
                connectionId = userData?.connections[selectedUserToChat]?.id
            } else {
                //when the person is not a connection than add the current user and connectionid to request list
                // console.log('dont have property')

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


    console.log('------->>>>>>>>-----------chat box ends------------------------')

    return (
        <div className="chat-body" >
            <div className="chat-box" id="chatBox" onScroll={handleScroll} ref={chatBoxRef} >
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
                        <section className="absolute-centered">No messages yet...</section>
                }
                <div ref={dummy}></div>
            </div>

            {userData?.requests[selectedUserToChat] ?
                <div className="req_btn">
                    <section className="enq_btn accept" onClick={() => acceptConnectionReq(db, userData, selectedUserToChat)} >Accept</section>
                    <div className="d-flex gap-1">
                        <section className="enq_btn delete mt-1" onClick={() => declineConnectionReq(db, userData, selectedUserToChat, setSelectedUserToChat)}>Delete</section>
                        <section className="enq_btn delete mt-1" onClick={() => blockConnection(db, userData, selectedUserToChat, setSelectedUserToChat)}>Block</section>
                    </div>
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
                </div>
            }
        </div>
    )
}

export default ChatBox