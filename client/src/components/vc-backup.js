import { collection } from 'firebase/firestore';
import React, { useState, useEffect, useRef } from 'react';
import SimplePeer from 'simple-peer';

const VideoCall = ({ database, }) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peer, setPeer] = useState(null);

    const myVideoRef = useRef();
    const remoteVideoRef = useRef();

    //   const callRef = database.ref('calls');
    const callRef = collection(database, 'v2');


    const servers = {
        iceServers: [
          {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'], // free stun server
          },
        ],
        iceCandidatePoolSize: 10,
    };
   

    useEffect(() => {
        
        const initializeMediaStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                myVideoRef.current.srcObject = stream;

                // Listen for changes in the call data
                callRef.on('value', (snapshot) => {
                    const callData = snapshot.val();

                    if (callData && !peer) {
                        const peer = new SimplePeer({ initiator: false, stream });
                        setPeer(peer);

                        peer.on('signal', (data) => {
                            // Send the signal data to the other user
                            callRef.update({ signalData: data });
                        });

                        peer.on('stream', (stream) => {
                            // Receive and set the remote stream
                            setRemoteStream(stream);
                            remoteVideoRef.current.srcObject = stream;
                        });

                        // Use the signal data received from the other user
                        if (callData.signalData) {
                            peer.signal(callData.signalData);
                        }
                    }
                });
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        initializeMediaStream();
    }, []);

    const startCall = () => {
        const peer = new SimplePeer({ initiator: true, stream: localStream });
        setPeer(peer);

        peer.on('signal', (data) => {
            // Send the signal data to the other user
            callRef.update({ signalData: data });
        });

        peer.on('stream', (stream) => {
            // Receive and set the remote stream
            setRemoteStream(stream);
            remoteVideoRef.current.srcObject = stream;
        });
    };

    const endCall = () => {
        // Clear the remote stream
        setRemoteStream(null);
        remoteVideoRef.current.srcObject = null;

        // Close the peer connection
        if (peer) {
            peer.destroy();
            setPeer(null);
        }

        // Remove the call data from the database
        callRef.remove();
    };

    return (
        <div>
            <video ref={myVideoRef} autoPlay muted style={{ width: '200px', height: '150px' }}></video>
            <video ref={remoteVideoRef} autoPlay style={{ width: '200px', height: '150px' }}></video>
            <div>
                <button onClick={startCall}>Start Call</button>
                <button onClick={endCall}>End Call</button>
            </div>
        </div>
    );
};

export default VideoCall;
