import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import MessageWrapper from './MessageWrapper';
import notification from "./../assets/discord.mp3";
import { acceptConnectionReq, blockConnection, declineConnectionReq, writeToDb } from '../utils';

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
            console.log('useefct in chatbox--')
            retrieveTexts(selectedUserToChat);

            // realtimeListener(selectedUserToChat)


            // Set up the real-time listener for receiving messages
            const connectionId = userData?.connections[selectedUserToChat]?.id;
            const messagesRef = collection(db, 'v2');
            const queryRef = query(messagesRef, where("connectionId", "==", connectionId), orderBy("time", "desc"), limit(1));

            const unsubscribe = onSnapshot(queryRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const newMessage = { id: change.doc.id, ...change.doc.data() };
                        setMessageList((prevMessages) => [...prevMessages, newMessage]);
                        dummy.current?.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            // Clean up the subscription when the component unmounts
            return () => {
                unsubscribe();
            };

        }

    }, [selectedUserToChat])



    console.log('messagelist-----_____---', messageList)


    async function retrieveTexts(userToChat) {
        console.log('retrieveTexts', userData, userToChat)
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

        console.log('gettexts', connectionId, selectedUserToChat, userData, chatsTill)

        // NEW TRY
        if (connectionId) {
            const messagesRef = collection(db, 'v2');
            let queryRef = query(messagesRef, where("connectionId", "==", connectionId), orderBy("time", "desc"), limit(2));

            if (lastVisible.current) {
                console.log('lastVisible.current', lastVisible.current)
                queryRef = query(messagesRef, where("connectionId", "==", connectionId), orderBy("time", "desc"), startAfter(lastVisible.current), limit(2));
            }

            const querySnapshot = await getDocs(queryRef);
            const newMessages = [];

            querySnapshot.forEach((doc) => {
                newMessages.push({ id: doc.id, ...doc.data() });
            });

            newMessages.reverse()
            console.log('oldMsagesss--------', messageList)

            console.log('newmesssagesss--------', newMessages)

            setMessageList((prevMessages) => [...newMessages, ...prevMessages]);
            dummy.current?.scrollIntoView({ behaviour: 'smooth' })//maybe just runn it on snapshot

            // Update the reference to the last visible document
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            lastVisible.current = lastDoc;


            // //triggering realtime update func
            // realtimeListener(connectionId)

        }
        // NEW TRY END
        return;

        //only messages after last delete are queried
        let q;
        if (chatsTill) {
            q = query(collection(db, "v2"), where("connectionId", "==", connectionId), where("time", ">", chatsTill), orderBy("time", "desc"), limit(2));
        } else {
            q = query(collection(db, "v2"), where("connectionId", "==", connectionId), orderBy("time", "desc"), limit(2));
        }

        if (connectionId) {
            onSnapshot(q, (querySnapshot) => {

                const msgs = [];
                console.log('chat snapshot running...')
                querySnapshot.forEach((doc) => {
                    let data = doc.data()
                    data.id = doc.id;
                    msgs.push(data);

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
    }


    const loadMoreTexts = async (target) => {
        setLoading(true);
        const { scrollHeight } = target;
        const prevheight = scrollHeight;

        try {
            retrieveTexts(selectedUserToChat)

        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);

            setTimeout(() => {
                console.log('dfskjkjdfsjdfs', prevheight, chatBoxRef.current.scrollHeight)
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


    //   Real-time updates for new messages
    async function realtimeListener(selectedUser) {
        console.log('uddddd', selectedUser)

        const messagesRef = collection(db, 'v2');
        // if (chatsTill) {
        //   q = query(collection(db, "v2"), where("connectionId", "==", connectionId), where("time", ">", chatsTill), orderBy("time", "desc"), limit(2));
        // } else {
        //   q = query(collection(db, "v2"), where("connectionId", "==", connectionId), orderBy("time", "desc"), limit(2));
        // }

        const connectionId = userData?.connections[selectedUser]?.id;
        if (connectionId) {
            console.log('is connectionId true', connectionId)

            onSnapshot(query(messagesRef, where("connectionId", "==", connectionId), orderBy('time', 'desc'), limit(1)), (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const newMessage = { id: change.doc.id, ...change.doc.data() };
                        console.log('new--------------------', change, newMessage)
                        setMessageList((prevMessages) => [newMessage, ...prevMessages]);
                    }
                });
            });
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

    return (
        <div className="chat-body" >
            <div className="chat-box" id="chatBox" onScroll={handleScroll} ref={chatBoxRef} >
                {loading ?
                    <div class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="sr-only"></span>
                        </div>
                    </div>
                    :
                    <div className="text-center load_more"><span>load more</span></div>
                    // <section className="text-center spinner">Load more texts</section>
                }

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