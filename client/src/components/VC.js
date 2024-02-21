import { addDoc, collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import React, { useState, useEffect, useRef } from 'react';
import SimplePeer from 'simple-peer';

// import peer from './webRTCService'
import { useSelector } from 'react-redux';
import { populateConnectionId } from '../utils';

const VideoCall = ({ database, selectedUserToChat, isIncomming, isAccepted, theOfferRequest, theOfferResponse,peer }) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const myVideoRef = useRef();
    const remoteVideoRef = useRef();

    const currentUser = useSelector(state => state.user.currentUser)
    const userData = useSelector(state => state.user.userInfo) // user info like connection list, email

    function getConnectionId(userName) {
        //checking if the user in connection list or request list
        if (userData?.connections?.hasOwnProperty(userName)) {
            return populateConnectionId(userData.connections[userName])
        } else if (userData?.requests?.hasOwnProperty(userName)) {
            return populateConnectionId(userData.requests[userName])
        } else {
            return populateConnectionId(undefined)
        }
    }

    useEffect(() => {
        if (selectedUserToChat) {
            console.log('useEffect in vc--')
            realtimeListener(selectedUserToChat)
        }
    }, [selectedUserToChat])

    // NOTE: HVAE TO MOVE THE SNAPSHOT HERE TO GET ALL THE VC LOGIC HERE
    let isRealTimeUpdate = true;
    function realtimeListener(selectedUser) {
        console.log('realtimeListener in vc', selectedUser)

        isRealTimeUpdate = false;
        const { connectionId } = getConnectionId(selectedUser)

        if (connectionId) {
            const messagesRef = collection(database, 'v2');
            let queryRef = query(messagesRef, where("connectionId", "==", connectionId), orderBy("time", "desc"), limit(1));

            onSnapshot(queryRef, (snapshot) => {

                let newMessage = {};
                snapshot.forEach((doc) => {
                    newMessage = { id: doc.id, ...doc.data() }
                });

                //only updates when the onsnapshot is triggered oragnically and not by useEffct (only code inside onSnapshot block will run)
                if (isRealTimeUpdate) {
                    console.log(' ---newMessage--vc', newMessage)

                    // WHen newmessage is an offer (icoming call, than we have to show the popup for incoming call, or we can redirect to vc componnet and there show the buttons for pickup or hangup along with media running)

                    if (newMessage.type === "vc" && newMessage.author !== currentUser.displayName) {
                        // const offer = JSON.parse(newMessage.offer)
                        // newMessage.offer = offer;
                        // console.log('its vc', offer)
                        // // from here the user will be sent to vc screen , there his camera will be open,, but the vc wont start, at the bottom button to pickup and hangup will be hsown,., these buttons will be rendered by passing a incoming sttae, which will be set true from here and that way , these button will be shown only on incoming calls,,, whne the pickup button will be clicked only then accept the users offer

                        // // we need to return the offer acceptance answer,, for that we should update this same message, so that we wont have unnecesaary multiple messages just for one connection,

                        // // setIsIncoming(true)
                        // setTheOfferRequest(newMessage)
                        // setVideoReq(true)// fix this,, setting it here is making both chatbox and vc rerender// either move the button chatbox compo or put header for every componnet instead of at top level

                        return;
                    }else{
                        if (newMessage.offerRes) {
                            console.log('if offeres true')
                            const offerRes = JSON.parse(newMessage.offerRes)
                            console.log('offffferres',offerRes)
                            // setIsAccepted(true)
                            handleCallAccepted(offerRes);
                            // setTheOfferResponse(offerRes)
                            return;
                        }
                    }

                    // setMessageList((prevArray) => {
                    //     const isDuplicate = prevArray.some((existingObject) => existingObject.id === newMessage.id);
                    //     if (snapshot.metadata.hasPendingWrites) { //(tells if the doc has been written at server)
                    //         const time = new Date().toISOString()
                    //         newMessage.time = time;
                    //     }
                    //     return isDuplicate ? prevArray : [...prevArray, newMessage];
                    // })
                    // if (newMessage?.author !== userData.username) {
                    //     const audio = new Audio(notification);
                    //     audio.play(); // this is playing twice [fixed]
                    // }
                    // if (!lastVisible.current) {
                    //     const lastDoc = snapshot.docs[snapshot.docs.length - 1];
                    //     lastVisible.current = lastDoc;
                    // }
                    // dummy.current?.scrollIntoView({ behaviour: 'smooth' })//maybe just runn it on snapshot
                }

                isRealTimeUpdate = true;
            })

        }
    }



    // https://medium.com/spidernitt/building-a-video-chat-app-with-webrtc-firebase-8546edb860d5
    useEffect(() => {

        const initializeMediaStream = async () => {
            try {
                //setting up media devices----------
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                myVideoRef.current.srcObject = stream;

            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        initializeMediaStream();
    }, []);

    const handleCallAccepted = async (offerRes) => {
        console.log('handleCallAccepted',offerRes)
        peer.setLocalDescription(offerRes)
        console.log('call accepted')
        for (const track of localStream.getTracks()) {
            peer.peer.addTrack(track, localStream);
        }
    }
    // useEffect(() => {
    //     const handleCallAccepted = async () => {
    //         console.log('handleCallAccepted',theOfferResponse)
    //         peer.setLocalDescription(theOfferResponse.offerRes)
    //         console.log('call accepted')
    //         for (const track of localStream.getTracks()) {
    //             peer.peer.addTrack(track, localStream);
    //         }
    //     }
    //     if (isAccepted) handleCallAccepted();
    // }, [isAccepted])

    useEffect(() => {
        const handleIncoming = async () => {
            console.log('theOfferRequest', theOfferRequest)
            const ans = await peer.getAnswer(theOfferRequest.offer)
            //hvae to make sure that this code never runs twice, as it throws error bcz when it rerenders it tries to connect with the same peer again but it already has a connection.

            console.log('ansss', ans)


            const offerDocRef = doc(database, "v2", theOfferRequest.id);
            await updateDoc(offerDocRef, {
                offerRes: JSON.stringify(ans) || null,
            });

        }

        if (isIncomming) handleIncoming();
        //this function should run when user clicks on pick call
    }, [isIncomming])

    useEffect(() => {
        peer.peer.addEventListener('track', async ev => {
            const remoteStream = ev.streams;
            setRemoteStream(remoteStream)
            remoteVideoRef.current.srcObject = remoteStream;
        })
    }, [])

    const pickCall = () => {

    }



    return (
        <div>
            <video ref={myVideoRef} autoPlay muted style={{ width: '200px', height: '150px' }}></video>
            <video ref={remoteVideoRef} autoPlay style={{ width: '200px', height: '150px' }}></video>
            <div>
                {isIncomming &&
                    <button onClick={pickCall}>PICK UP</button>
                }
                <button >End Call</button>
            </div>
        </div>
    );
};

export default VideoCall;
