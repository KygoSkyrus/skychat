import { Timestamp, addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc } from "firebase/firestore"
import { setToast, showLoader } from "./redux/actionCreators";

export function getDateStr(date) {
    let d = new Date(date)
    return d.getDate() + "-" + (d.getMonth() + 1) + "-" + (d.getFullYear())
}
export function getFullDateStr(date) {
    let m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let d = new Date(date)
    return d.getDate() + " " + (m[d.getMonth()]) + " " + (d.getFullYear()) + ", " + (d.getHours() < 12 ? d.getHours() : d.getHours() - 12) + ":" + (d.getMinutes()) + " " + (d.getHours() < 12 ? "AM" : "PM")
}

export function deriveDate(d) {
    let date = new Date(d);
    return getExactTimeStr(date);
}

export function getExactTimeStr(d) {
    return (
        (d?.getHours() === 0 ? 12 :
            (d?.getHours() <= 12 ?
                d?.getHours() :
                d?.getHours() - 12))
        + ":" +
        (d?.getMinutes().toString().padStart(2, '0'))
        + " " +
        (d?.getHours() < 12 ? "AM" : "PM")
    )
}


export function getLocalDateStr(d) {
    let date = typeof (d) == 'object' ? d?.toDate() : new Date(d);
    return date.toLocaleDateString('en-in', { year: "numeric", month: "short", day: "numeric" });
}


export async function writeToDb(db, msgObj) {
    try {
        await addDoc(collection(db, "v2"), msgObj);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}


// Debounce function to delay API calls by a specified time
export function debounce(func, wait) {
    let timeoutId;
    return function (...args) {
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), wait);
    };
}

export async function acceptConnectionReq(db, userData, userName, dispatch) {
    if (userData?.requests?.hasOwnProperty(userName)) {
        dispatch(showLoader(true));

        let connectionId = userData.requests[userName]?.id;
        let deletedTill = userData.requests[userName]?.deletedTill || Timestamp.fromDate(new Date('1970'));

        delete userData.requests[userName];
        //moving connection from req list to connection list 
        const docRef = doc(db, "users", userData?.id);
        await updateDoc(docRef, {
            requests: userData.requests,
            connections: {
                ...userData.connections,
                [userName]: {
                    id: connectionId,
                    deletedTill: deletedTill,
                },
            }
        });
        dispatch(showLoader(false));
        dispatch(setToast(`Request accepted`, false))
    }
}

export async function acceptGroupReq(db, userData, id, dispatch) {
    if (userData?.requests?.hasOwnProperty(id)) {
        dispatch(showLoader(true));
        let groupName = userData.requests[id]?.groupName;
        let deletedTill = userData.requests[id]?.deletedTill || Timestamp.fromDate(new Date('1970'));

        delete userData.requests[id];
        //moving group from req list to connection list 
        const docRef = doc(db, "users", userData?.id);
        await updateDoc(docRef, {
            requests: userData.requests,
            connections: {
                ...userData.connections,
                [id]: {
                    id,
                    groupName,
                    deletedTill: deletedTill,
                },
            }
        });
        dispatch(showLoader(false));
    }
}

export async function declineConnectionReq(db, userData, userName, setSelectedUserToChat, dispatch) {
    //delete msgs here , don't remove from req list
    if (userData?.requests?.hasOwnProperty(userName)) {
        dispatch(showLoader(true));

        userData.requests[userName].deletedTill = serverTimestamp();
        const docRef = doc(db, "users", userData?.id);
        await updateDoc(docRef, {
            requests: userData.requests,
        });

        setSelectedUserToChat(undefined)
        dispatch(showLoader(false));
    }
}

export async function blockConnection(db, userData, id, setSelectedUserToChat, dispatch) {
    dispatch(showLoader(true));
    let connectionId = '';
    //connection is moved to block list from connection list or req list / messages are not deleted

    if (userData?.connections?.hasOwnProperty(id)) {
        connectionId = userData.connections[id]?.id;
        delete userData.connections[id];
        updateUserDoc();
    } else if (userData?.requests?.hasOwnProperty(id)) {
        connectionId = userData.requests[id]?.id;
        delete userData.requests[id];
        updateUserDoc();
    }

    async function updateUserDoc() {
        const docRef = doc(db, "users", userData?.id);
        await updateDoc(docRef, {
            connections: userData.connections,
            requests: userData.requests,
            blockList: {
                ...userData.blockList,
                [id]: {
                    id: connectionId,
                    blockedAt: serverTimestamp(),
                }
            }
        });

        setSelectedUserToChat(undefined);
        dispatch(showLoader(false));
    }
}


export const exitGroup = async (dispatch, db, userData, id, setSelectedUserToChat, isTriggeredByAdmin = false) => {
    // @params: isTriggeredByAdmin-> will be false when this function is triggered by user(who's leaving), and if true it means user is being removed

    dispatch(showLoader(true));

    //removing member from group list 
    const docRef = doc(db, "group", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        let data = docSnap.data();
        let newMemberList = data.members.filter(x => x.name !== userData?.username)
        data.members = newMemberList;
        await updateDoc(docRef, data); // updating document
    }

    //connection is deleted from connection list or req list
    if (userData?.connections?.hasOwnProperty(id)) {
        delete userData.connections[id];
        updateUserDoc();
    } else if (userData?.requests?.hasOwnProperty(id)) {
        delete userData.requests[id];
        updateUserDoc();
    }

    async function updateUserDoc() {
        //deleting connection req from req list 
        const docRef = doc(db, "users", userData?.id);
        await updateDoc(docRef, {
            connections: userData.connections,
            requests: userData.requests,
            blockList: userData.blockList,
        });

        if (setSelectedUserToChat) setSelectedUserToChat(undefined);
    }

    if (!isTriggeredByAdmin) {
        // SENDING NOTIFICATION (USER LEFT)
        const msgData = {
            connectionId: id,
            author: userData?.username,
            message: `${userData?.username} left`,
            time: serverTimestamp(),
            isNotification: true,
            type: "left",
        };
        await writeToDb(db, msgData);
    }
    dispatch(showLoader(false));
}


export async function getUsersList(db) {
    let userList = {};
    let q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        userList[data?.username] = {
            avatar: data?.avatar,
            privacy: data?.privacy,
        };
    });
    return userList;
}

export function getConnectionId(userData, userName) {
    if (userData?.connections?.hasOwnProperty(userName)) {
        return populateConnectionId(userData.connections[userName])
    } else if (userData?.requests?.hasOwnProperty(userName)) {
        return populateConnectionId(userData.requests[userName])
    } else {
        return populateConnectionId(null)
    }
}

export function populateConnectionId(obj) {
    let connectionId = obj?.id || undefined;
    let chatsTill = obj?.deletedTill || null;
    let exitAt = obj?.exitAt || null;
    return { connectionId, chatsTill, exitAt };
}

export function getFormattedNotification(msgData, myName) {
    let temp;
    // if the notification is for adding and removing a member
    if (msgData?.type === "added" || msgData?.type === "removed") {
        temp = msgData?.message?.split(` ${msgData?.type} `);
        if (temp[1] === myName) return `${temp[0]} ${msgData?.type} you`;
    }
    return msgData?.message;
}

export async function doesUserExistApi(username, email) {
    try {
        let res = await fetch(`/api/doesUserExist`, {
            // let res = await fetch(`https://skychat-dg.onrender.com/api/doesUserExist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, email
            })
        })
        let data = await res.json();
        return data;
    } catch (error) {
        return false;
    }
}

export function toggleLoginFields(val) {
    // val== true // hide fields
    let zIndex = 1;
    let opacity = 1;
    if (val) {
        zIndex = 4;
        opacity = 0.1;
    }
    document.getElementById('username').style.zIndex = zIndex;
    document.querySelector('.googleBtn').style.zIndex = zIndex;

    document.getElementById('email1').style.opacity = opacity;
    document.getElementById('password1').style.opacity = opacity;
    document.querySelector('.toggle').style.opacity = opacity;
    document.querySelector('.continue-with').style.opacity = opacity;
    document.querySelector('.createAcc').style.opacity = opacity;
}

export function toggleUsernameField(val) {
    // val== true // hide fields
    let zIndex = 1;
    if (val) zIndex = 4;

    document.getElementById('username').classList.toggle('d-none');
    document.getElementById('username').style.zIndex = zIndex;

    document.querySelector('.googleBtn').classList.toggle('d-none');
    document.querySelector('.googleBtn').style.zIndex = zIndex;

    document.querySelector('.continue').classList.toggle('d-none');
    document.querySelector('.continue').style.zIndex = zIndex;
}

export function getAvatarUrl(i) {
    return `https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2Favatar%20(${i}).png?alt=media&token=4c4b0ea3-519f-430c-9f0f-8c24df8d163c`
}
export const defaultAvatar = 'https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a'

export function getPatternUrl(i) {
    return `https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/patterns%2Fpattern%20(${i}).jpg?alt=media&token=66fa6c1d-4de8-4d33-8824-71095a0c8a4d`
}
export const defaultTheme = 'https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/patterns%2Fpattern%20(36).jpg?alt=media&token=66fa6c1d-4de8-4d33-8824-71095a0c8a4d';