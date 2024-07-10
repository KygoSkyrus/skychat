import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';
import EmojiPicker from 'emoji-picker-react';
import { Send, SmilePlus } from 'lucide-react';
import { collection, query, where, doc, orderBy, getDocs, serverTimestamp, limit, updateDoc, onSnapshot, startAfter } from "firebase/firestore";

import MessageWrapper from './MessageWrapper';
import notification from "./../assets/discord.mp3";
import { FirebaseContext } from '../firebaseContext';
import { setToast, showConfirmationModal } from '../redux/actionCreators';
import { acceptConnectionReq, blockConnection, declineConnectionReq, getLocalDateStr, writeToDb, exitGroup, acceptGroupReq, getFormattedNotification, defaultTheme, getConnectionId } from '../utils';


const ChatBox = ({ selectedUserToChat, setSelectedUserToChat, isGroupSelected }) => {
    let prevDate = '';

    const dispatch = useDispatch();
    const { db } = useContext(FirebaseContext);

    const dummy = useRef(); // responsible to scroll into view whenever msgs are recieved/sent
    const chatBoxRef = useRef(null);
    const inputRef = useRef(null); // ref to input field
    const lastVisible = useRef(null); //reference to the last loaded text

    const userData = useSelector(state => state.user.userInfo) // user info like connection list, email
    const currentUser = useSelector(state => state.user.currentUser)
    const requestList = useSelector(state => state.user.requestList) // has request list connections (connections to show)

    const [loading, setLoading] = useState(false);
    const [messageList, setMessageList] = useState([]) //messages with the current user
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);


    useEffect(() => {
        if (selectedUserToChat) {
            lastVisible.current = null; // clearing lastMsg ref for new selected user
            realtimeListener(selectedUserToChat)
            retrieveTexts(selectedUserToChat, true);
        }

        document.getElementById('theText')?.focus(); // focus on input field
    }, [selectedUserToChat])


    useEffect(() => {
        // to close the chat window for group if the user is removed by admin
        if (!userData?.connections?.hasOwnProperty(selectedUserToChat) && !userData?.requests?.hasOwnProperty(selectedUserToChat) && isGroupSelected) {
            setSelectedUserToChat(undefined);
        }

        const theme = userData?.theme || defaultTheme;
        chatBoxRef.current.style.backgroundImage = `url('${theme}')`;
    }, [userData])

    async function retrieveTexts(userToChat, isNewChat = false) {
        const { connectionId, chatsTill, exitAt } = getConnectionId(userData, userToChat)
        getTexts(connectionId, chatsTill, exitAt, isNewChat)
    }

    async function getTexts(connectionId, chatsTill, exitAt, isNewChat) {
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
                if (isNewChat) setMessageList([]); // to reset the msglist for new chat
            } else {
                newMessages.reverse()
                if (isNewChat) setMessageList(newMessages); // no previous msgs are there when new user is seleted to chat
                else setMessageList((prevMessages) => [...newMessages, ...prevMessages]);

                dummy.current?.scrollIntoView({ behaviour: 'smooth' });

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
        isRealTimeUpdate = false;
        let cId; // connection ID
        if (id) {
            cId = id;
        } else {
            const { connectionId } = getConnectionId(userData, selectedUser)
            cId = connectionId;
        }

        if (cId) {
            const messagesRef = collection(db, 'v2');
            let queryRef = query(messagesRef, where("connectionId", "==", cId), orderBy("time", "desc"), limit(1));

            onSnapshot(queryRef, (snapshot) => {

                let newMessage = {};
                snapshot.forEach((doc) => {
                    newMessage = { id: doc.id, ...doc.data() }
                });

                //only updates when the onsnapshot is triggered oragnically and not by useEffct (only code inside onSnapshot block will run)
                if (isRealTimeUpdate) {
                    setMessageList((prevArray) => {
                        const isDuplicate = prevArray.some((existingObject) => existingObject.id === newMessage.id);
                        if (snapshot.metadata.hasPendingWrites) { //(tells if the doc has been written at server)
                            const time = new Date().toISOString()
                            newMessage.time = time;
                        }
                        return isDuplicate ? prevArray : [...prevArray, newMessage];
                    })

                    // only play this audio when msg is from other user
                    if (newMessage?.author !== userData.username) {
                        const audio = new Audio(notification);
                        audio.play();
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

    const loadMoreTexts = async (target) => {
        setLoading(true);
        const { scrollHeight } = target;
        const prevheight = scrollHeight;

        try {
            retrieveTexts(selectedUserToChat)
        } catch (error) {
        } finally {
            setLoading(false);
            setTimeout(() => {
                chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight - prevheight
            }, 500);
        }
    };

    const handleScroll = (e) => {
        const { scrollTop } = e.target;
        // Checks if the user has scrolled to the top
        if (scrollTop === 0 && !loading && messageList.length > 0) loadMoreTexts(e.target);
    };

    async function sendText() {
        // Validate and sanitize message
        if (validator.isEmpty(inputRef?.current?.value.trim())) {
            return;
        }
        if (inputRef?.current?.value?.length > 500) {
            dispatch(setToast('Message length exceeded', true))
            return;
        }
        const sanitizedMessage = validator.escape(inputRef?.current?.value);
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
            connectionId = uuidv4();
            const userDocRef = doc(db, "users", userData.id);
            // updating the user document with new connection in connection list
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
                receiverDoc = { ...doc.data(), id: doc.id }
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
            message: sanitizedMessage,
            time: serverTimestamp(),
            deletedBy: [],
        };

        writeToDb(db, msgData);
        inputRef.current.value = '';
        if (showEmojiPicker) setShowEmojiPicker(false);

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

    const showChatDate = (currDate) => {
        if (prevDate !== currDate) {
            prevDate = currDate;
            return true;
        }
        return false;
    }

    const onEmojiClick = (event) => {
        let sym = event.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        inputRef.current.value += emoji;
    }

    return (
        <div className="chat-body" id="chatBody">
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
                }

                {messageList?.length > 0 ?
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
                                        <span className="fs-12 px-2" style={{ background: "var(--blue)" }}>
                                            {getFormattedNotification(msgData, userData?.username)}
                                        </span>
                                    </div>
                                    :
                                    // dont show if the msg is deleted by me but i am not its author (for v3)
                                    <MessageWrapper msgData={msgData} myself={currentUser?.displayName} isGroupSelected={isGroupSelected} setMessageList={setMessageList} />
                                }
                            </div>
                        )
                    })
                    :
                    <section className="absolute-centered">Say 'Hi' to start a conversation</section>
                }
                <div ref={dummy}></div>
            </div>

            {requestList?.includes(selectedUserToChat) ?
                // when request chat is opened
                (<div className="req_btn zIndex1">
                    <section className="enq_btn accept" onClick={() => userData?.requests[selectedUserToChat]?.groupName ? acceptGroupReq(db, userData, selectedUserToChat, dispatch) : acceptConnectionReq(db, userData, selectedUserToChat, dispatch)} >Accept</section>
                    <div className="d-flex gap-1">
                        {userData?.requests[selectedUserToChat]?.groupName ?
                            <section className="enq_btn delete mt-1" onClick={() => dispatch(showConfirmationModal(`Are you sure you want to leave this group?`, () => exitGroup(dispatch, db, userData, selectedUserToChat, setSelectedUserToChat, false)))}>Leave group</section>
                            :
                            <>
                                <section className="enq_btn delete mt-1" onClick={() => dispatch(showConfirmationModal(`Are you sure you want to decline this connection request?`, () => declineConnectionReq(db, userData, selectedUserToChat, setSelectedUserToChat, dispatch)))}>Decline</section>
                                <section className="enq_btn delete d2 mt-1" onClick={() => dispatch(showConfirmationModal(`Are you sure you want to block <code>${selectedUserToChat}</code>?`, () => blockConnection(db, userData, selectedUserToChat, setSelectedUserToChat, dispatch)))}>Block</section>
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
                            id="theText"
                            ref={inputRef}
                            type="text" name="msg"
                            placeholder="...type"
                            autoComplete="off"
                            className="my-1"
                            onKeyUp={(e) => e.key === "Enter" && sendText()}
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
                            />
                        </div>
                        <button onClick={() => sendText()} className="sendBtn"><Send /></button>
                    </div>
                )
            }
        </div>
    )
}

export default ChatBox