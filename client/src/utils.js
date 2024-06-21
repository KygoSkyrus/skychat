import { Timestamp, addDoc, collection, doc, getFirestore, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { onSnapshot, query, where } from "firebase/firestore";
import { SET_TOAST } from "./redux/actionTypes"

export const dbUsers = {
    "test1": {
        "blockList": {
            "test6": {
                "id": "5ea00230-b709-4049-8e67-2703bff76ee9",
                "blockedAt": {
                    "seconds": 1715866673,
                    "nanoseconds": 70000000
                }
            }
        },
        "username": "test1",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2Favatar%20(8).png?alt=media&token=4c4b0ea3-519f-430c-9f0f-8c24df8d163c",
        "connections": {
            "test2": {
                "deletedTill": {
                    "seconds": 1717784032,
                    "nanoseconds": 193000000
                },
                "id": "9afbe648-40f3-4f49-a574-873be66338d0"
            },
            "90bd529e-a8e1-4667-8607-b6dda7356641": {
                "groupName": "i2",
                "id": "90bd529e-a8e1-4667-8607-b6dda7356641"
            },
            "76a3aaec-0a4f-4901-b25a-5b4a6795ad28": {
                "groupName": "iii",
                "id": "76a3aaec-0a4f-4901-b25a-5b4a6795ad28"
            }
        },
        "privacy": true,
        "time": {
            "seconds": 1704899512,
            "nanoseconds": 878000000
        },
        "email": "test1@email.com",
        "requests": {},
        "id": "AMaRvZRYFUMabQKINmNF"
    },
    "test6": {
        "username": "test6",
        "requests": {
            "test2": {
                "id": "1162eb04-dd2d-49af-b0b3-6aee795bef32"
            }
        },
        "time": {
            "seconds": 1711534119,
            "nanoseconds": 748000000
        },
        "privacy": true,
        "blockList": {},
        "email": "test6@email.com",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "connections": {},
        "id": "DIJJjPqUTPoYddxY2TcT"
    },
    "test3": {
        "email": "test3@email.com",
        "blockList": {},
        "connections": {
            "test1": {
                "id": "1ec282e6-f95d-4dab-ad61-c5e79fc16283"
            },
            "test5": {
                "id": "5a5af813-6c6d-4f2c-b46f-d023dd865f7e"
            },
            "test2": {
                "id": "0930b102-9779-4b3c-9b59-6fba1f006b55"
            }
        },
        "username": "test3",
        "requests": {
            "90bd529e-a8e1-4667-8607-b6dda7356641": {
                "groupName": "i2",
                "id": "90bd529e-a8e1-4667-8607-b6dda7356641",
                "deletedTill": {
                    "seconds": 1717927718,
                    "nanoseconds": 560000000
                }
            }
        },
        "time": {
            "seconds": 1705165774,
            "nanoseconds": 289000000
        },
        "privacy": false,
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "id": "I5q047QCTEAgMowlYLBE"
    },
    "test2": {
        "connections": {
            "test6": {
                "id": "1162eb04-dd2d-49af-b0b3-6aee795bef32"
            },
            "test1": {
                "id": "9afbe648-40f3-4f49-a574-873be66338d0"
            }
        },
        "blockList": {},
        "username": "test2",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "privacy": true,
        "requests": {
            "90bd529e-a8e1-4667-8607-b6dda7356641": {
                "id": "90bd529e-a8e1-4667-8607-b6dda7356641",
                "deletedTill": {
                    "seconds": 1717927718,
                    "nanoseconds": 143000000
                },
                "groupName": "i2"
            }
        },
        "email": "test2@email.com",
        "time": {
            "seconds": 1704899556,
            "nanoseconds": 460000000
        },
        "id": "MSOGk7iP40CehhYW5x5I"
    },
    "test5": {
        "connections": {},
        "email": "test5@email.com",
        "privacy": true,
        "time": {
            "seconds": 1706630048,
            "nanoseconds": 445000000
        },
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "username": "test5",
        "requests": {
            "90bd529e-a8e1-4667-8607-b6dda7356641": {
                "groupName": "i2",
                "id": "90bd529e-a8e1-4667-8607-b6dda7356641",
                "deletedTill": {
                    "seconds": 1717927717,
                    "nanoseconds": 715000000
                }
            }
        },
        "blockList": {},
        "id": "tkKDVsww5962mnrHBhec"
    }
}

export function getDateStr(date) {
    let d = new Date(date)
    return d.getDate() + "-" + (d.getMonth() + 1) + "-" + (d.getFullYear())
}
export function getFullDateStr(date) {
    let m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let d = new Date(date)
    return d.getDate() + " " + (m[d.getMonth()]) + " " + (d.getFullYear()) + ", " + (d.getHours() < 12 ? d.getHours() : d.getHours() - 12) + ":" + (d.getMinutes()) + " " + (d.getHours() < 12 ? "AM" : "PM")
}

export function getExactTimeStr(d) {
    //let d = new Date(date)
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
        const docRef = await addDoc(collection(db, "v2"), msgObj);
        //console.log("message send with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


export function hideSearchedUsersList(setSearchedUserList) {
    console.log('hideSearchedUsersList')
    clearSearchList(setSearchedUserList)
    // document.getElementById('userSearchDropdown').classList.toggle('d-none')//hiding the dropdown
}

export const sidebarVisibility = (val) => {
// export const sidebarVisibility = (val, setSearchedUserList) => {
    let sidebar = document.getElementById("mySidebar");
    let overlay = document.querySelector('.overlay');

    if (val) {
        sidebar.style.display = "flex";
        overlay?.classList.remove('d-none');
    } else {
        sidebar.style.display = "none";
        overlay?.classList.add('d-none');

        // clearSearchList(setSearchedUserList);//getting rid of this setSearchedUserList state
    }
};

function clearSearchList(setSearchedUserList) {
    setSearchedUserList(undefined)  //clearing all records
    document.querySelector('[type="search"]').value = "";//clearing the input on focus out
    document.getElementById('userSearchDropdown').classList.add('d-none')
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


export function getAvatarUrl(i) {
    return `https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2Favatar%20(${i}).png?alt=media&token=4c4b0ea3-519f-430c-9f0f-8c24df8d163c`
}
export const defaultAvatar = 'https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a'


export function getPatternUrl(i) {
    return `https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/patterns%2Fpattern%20(${i}).jpg?alt=media&token=66fa6c1d-4de8-4d33-8824-71095a0c8a4d`
}

// export async function updateUserDoc(db, id, newValue) {
//     const docRef = doc(db, "users", id);
//     await updateDoc(docRef, newValue);
// }


export async function acceptConnectionReq(db, userData, userName, dispatch) {
    console.log('acceptConnectionReq', userName)

    if (userData?.requests?.hasOwnProperty(userName)) {

        let connectionId = userData.requests[userName]?.id;
        let deletedTill = userData.requests[userName]?.deletedTill || Timestamp.fromDate(new Date('1970'));

        // console.log('connecyion id', connectionId, userData.requests)

        delete userData.requests[userName];
        // console.log('connection id after', connectionId, userData)

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
        dispatch({ type: SET_TOAST, payload: { toastContent: "Request accepted", isError: false } })
    }
}

export async function acceptGroupReq(db, userData, id) {
    console.log('acceptGroupReq', id)

    if (userData?.requests?.hasOwnProperty(id)) {

        let groupName = userData.requests[id]?.groupName;
        let deletedTill = userData.requests[id]?.deletedTill || Timestamp.fromDate(new Date('1970'));

        // console.log('connecyion id', connectionId, userData.requests)

        delete userData.requests[id];
        // console.log('connection id after', connectionId, userData)

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
    }
}

export async function declineConnectionReq(db, userData, userName, setSelectedUserToChat) {
    console.log('declineConnectionReq', userName)

    //delete msgs here , don't remove from req list
    if (userData?.requests?.hasOwnProperty(userName)) {
        // delete userData.requests[userName];
        userData.requests[userName].deletedTill = serverTimestamp();

        //deleting connection req from req list 
        const docRef = doc(db, "users", userData?.id);
        await updateDoc(docRef, {
            requests: userData.requests,
        });

        setSelectedUserToChat(undefined)
    }
}

export async function blockConnection(db, userData, id, setSelectedUserToChat) {

    let connectionId = '';
    //connection is moved to block list from connection list or req list / messages are not deketed
    console.log('blockConnection', id)
    //current only connection list is handled here
    if (userData?.connections?.hasOwnProperty(id)) {
        connectionId = userData.connections[id]?.id;
        delete userData.connections[id];
        updateUserDoc();
    } else if (userData?.requests?.hasOwnProperty(id)) {
        connectionId = userData.requests[id]?.id;
        delete userData.requests[id];
        updateUserDoc();
    }

    // create a common function for this function,, pass the userdata and all keys
    async function updateUserDoc() {

        //deleting connection req from req list 
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

        setSelectedUserToChat(undefined)//only call when inner block button is clicked, not on list's btn, so that component wont render bcz of unneccesary state update
    }
}


export const exitGroup = async (db, userData, id, setSelectedUserToChat, isTriggeredByAdmin=false) => {
    // @params: isTriggeredByAdmin-> will be false when this function is triggered by user(who's leaving), and if true it means user is being removed

    //removing member from group list 
    const docRef = doc(db, "group", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        let data = docSnap.data();
        let newMemberList = data.members.filter(x => x.name !== userData?.username)
        data.members = newMemberList;

        await updateDoc(docRef, data);// updating document
    }


    //connection is deleted from connection list or req list / messages are not deleted
    console.log('exit group', id)
    // NOW DELETING the group connection when user leaves the group
    if (userData?.connections?.hasOwnProperty(id)) {
        // userData.connections[id].exitAt = serverTimestamp();
        delete userData.connections[id];
        updateUserDoc();
    } else if (userData?.requests?.hasOwnProperty(id)) {
        delete userData.requests[id];
        // userData.requests[id].exitAt = serverTimestamp();
        updateUserDoc();
    }


    async function updateUserDoc() {
        console.log('uddududuududud',userData)

        //deleting connection req from req list 
        const docRef = doc(db, "users", userData?.id);
        await updateDoc(docRef, {
            connections: userData.connections,
            requests: userData.requests,
            blockList: userData.blockList,
        });

        if (setSelectedUserToChat) setSelectedUserToChat(undefined);
        // setIsGroupSelected(false);8
    }

    if(!isTriggeredByAdmin){
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