import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState, useEffect, useRef } from 'react';
import SimplePeer from 'simple-peer';

import peer from './webRTCService'
import { useSelector } from 'react-redux';

const VideoCall = ({ database, selectedUserToChat, isIncomming }) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    // const [peer, setPeer] = useState(null);

    const myVideoRef = useRef();
    const remoteVideoRef = useRef();

    const callRef = collection(database, 'v2');


    const currentUser = useSelector(state => state.user.currentUser)
    const userData = useSelector(state => state.user.userInfo) // user info like connection list, email


    const servers = {
        iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'], // free stun server
            },
        ],
        iceCandidatePoolSize: 10,
    };

    // https://medium.com/spidernitt/building-a-video-chat-app-with-webrtc-firebase-8546edb860d5
    useEffect(() => {

        const initializeMediaStream = async () => {
            try {
                //setting up media devices----------
                // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                // setLocalStream(stream);
                // myVideoRef.current.srcObject = stream;


                const connectionId = userData?.connections[selectedUserToChat]?.id


                // INITIATING OUTGOING CALL
                const offer = await peer.getOffer();
                console.log('offer', offer)
                //this offer should be sent to slected user to call

                // this offer will act like a message, being a message it will alert user realtime for the incoming call, and also this will be saved , so in future we can shhow it in calllog,,
                // can add a type key here to differentiate it with messages, type can be vc for video call or ac for audio call
                // the offer is like a outgoing call
                const offerObj = {
                    connectionId: connectionId,
                    author: currentUser.displayName,
                    offer: JSON.stringify(offer) || null,
                    type: "vc",
                    time: serverTimestamp(),
                }
                await addDoc(collection(database, "v2"), offerObj);



            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        initializeMediaStream();
    }, []);


    const pickCall =()=>{
        
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
