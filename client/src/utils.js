import { Timestamp, addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { setToast, showLoader } from "./redux/actionCreators";

export const dbUsers = {
    "test7": {
        "requests": {},
        "username": "test7",
        "email": "test7@email.com",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "connections": {},
        "blockList": {},
        "time": {
            "seconds": 1718794109,
            "nanoseconds": 979000000
        },
        "id": "6xMBEu52vxV91YGuvcJs"
    },
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
        "connections": {
            "e4915541-734d-4318-8e62-a2df2cff6cdc": {
                "id": "e4915541-734d-4318-8e62-a2df2cff6cdc",
                "groupName": "xz"
            },
            "76a3aaec-0a4f-4901-b25a-5b4a6795ad28": {
                "groupName": "iii",
                "id": "76a3aaec-0a4f-4901-b25a-5b4a6795ad28"
            }
        },
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2Favatar%20(8).png?alt=media&token=4c4b0ea3-519f-430c-9f0f-8c24df8d163c",
        "time": {
            "seconds": 1704899512,
            "nanoseconds": 878000000
        },
        "requests": {
            "test2": {
                "deletedTill": {
                    "seconds": 1719072728,
                    "nanoseconds": 286000000
                },
                "id": "9afbe648-40f3-4f49-a574-873be66338d0"
            }
        },
        "username": "test1",
        "email": "test1@email.com",
        "privacy": false,
        "id": "AMaRvZRYFUMabQKINmNF"
    },
    "test6": {
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "privacy": true,
        "time": {
            "seconds": 1711534119,
            "nanoseconds": 748000000
        },
        "username": "test6",
        "email": "test6@email.com",
        "blockList": {},
        "connections": {},
        "requests": {
            "test2": {
                "id": "1162eb04-dd2d-49af-b0b3-6aee795bef32"
            }
        },
        "id": "DIJJjPqUTPoYddxY2TcT"
    },
    "test3": {
        "username": "test3",
        "privacy": false,
        "email": "test3@email.com",
        "blockList": {},
        "time": {
            "seconds": 1705165774,
            "nanoseconds": 289000000
        },
        "connections": {
            "test2": {
                "id": "0930b102-9779-4b3c-9b59-6fba1f006b55"
            },
            "test5": {
                "id": "5a5af813-6c6d-4f2c-b46f-d023dd865f7e"
            },
            "test1": {
                "id": "1ec282e6-f95d-4dab-ad61-c5e79fc16283"
            }
        },
        "requests": {
            "e4915541-734d-4318-8e62-a2df2cff6cdc": {
                "id": "e4915541-734d-4318-8e62-a2df2cff6cdc",
                "deletedTill": {
                    "seconds": 1718958241,
                    "nanoseconds": 183000000
                },
                "groupName": "xz"
            }
        },
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "id": "I5q047QCTEAgMowlYLBE"
    },
    "test2": {
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "requests": {
            "90bd529e-a8e1-4667-8607-b6dda7356641": {
                "groupName": "i2",
                "deletedTill": {
                    "seconds": 1717927718,
                    "nanoseconds": 143000000
                },
                "id": "90bd529e-a8e1-4667-8607-b6dda7356641"
            }
        },
        "privacy": false,
        "connections": {
            "test6": {
                "id": "1162eb04-dd2d-49af-b0b3-6aee795bef32"
            },
            "test1": {
                "id": "9afbe648-40f3-4f49-a574-873be66338d0"
            }
        },
        "email": "test2@email.com",
        "time": {
            "seconds": 1704899556,
            "nanoseconds": 460000000
        },
        "blockList": {},
        "username": "test2",
        "id": "MSOGk7iP40CehhYW5x5I"
    },
    "test14": {
        "username": "test14",
        "requests": {},
        "time": {
            "seconds": 1718877812,
            "nanoseconds": 239000000
        },
        "blockList": {},
        "email": "test14@email.com",
        "connections": {},
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "id": "Qhp4WEto8fsPIVU0dhRK"
    },
    "test18": {
        "requests": {},
        "connections": {},
        "email": "test18@email.com",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "username": "test18",
        "time": {
            "seconds": 1718965411,
            "nanoseconds": 272000000
        },
        "blockList": {},
        "id": "T3mWhER5Pnn6dY3eugLZ"
    },
    "test15": {
        "time": {
            "seconds": 1718878829,
            "nanoseconds": 380000000
        },
        "username": "test15",
        "connections": {},
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "email": "test15@email.com",
        "blockList": {},
        "requests": {},
        "id": "TkhDlix87oTMbQX55KbX"
    },
    "test17": {
        "email": "test17@email.com",
        "connections": {},
        "username": "test17",
        "requests": {},
        "blockList": {},
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "time": {
            "seconds": 1718964895,
            "nanoseconds": 962000000
        },
        "id": "ZikeZb69RzOjBaCVGsep"
    },
    "k 1": {
        "time": {
            "seconds": 1706549446,
            "nanoseconds": 270000000
        },
        "username": "k 1",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "privacy": true,
        "requests": {},
        "email": "k1@gmail.com",
        "connections": {},
        "blockList": {},
        "id": "bt3zYWzkcFYRJI1qanMK"
    },
    "superuser": {
        "username": "superuser",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "time": {
            "seconds": 1718793606,
            "nanoseconds": 45000000
        },
        "connections": {},
        "email": "test69@email.com",
        "requests": {},
        "blockList": {},
        "id": "mY2vBWmlLyuBHLR6zdew"
    },
    "test13": {
        "blockList": {},
        "username": "test13",
        "connections": {},
        "email": "test13@email.com",
        "requests": {},
        "time": {
            "seconds": 1718813631,
            "nanoseconds": 379000000
        },
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "id": "qEKnz7xslEHNhpPdQA5A"
    },
    "test12": {
        "email": "test12@email.com",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "time": {
            "seconds": 1718813413,
            "nanoseconds": 677000000
        },
        "username": "test12",
        "blockList": {},
        "requests": {},
        "connections": {},
        "id": "rt0EI41Io6rIxpu3hmwF"
    },
    "test16": {
        "requests": {},
        "blockList": {},
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "connections": {},
        "email": "test16@email.com",
        "username": "test16",
        "time": {
            "seconds": 1718964189,
            "nanoseconds": 611000000
        },
        "id": "th6PK9fT6gGA5e5o9Ymi"
    },
    "test5": {
        "time": {
            "seconds": 1706630048,
            "nanoseconds": 445000000
        },
        "blockList": {},
        "requests": {
            "90bd529e-a8e1-4667-8607-b6dda7356641": {
                "deletedTill": {
                    "seconds": 1717927717,
                    "nanoseconds": 715000000
                },
                "id": "90bd529e-a8e1-4667-8607-b6dda7356641",
                "groupName": "i2"
            }
        },
        "username": "test5",
        "connections": {},
        "privacy": true,
        "email": "test5@email.com",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
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

// i think its not used anywhere
export function hideSearchedUsersList(setSearchedUserList) {
    console.log('hideSearchedUsersList')
    clearSearchList(setSearchedUserList)
    // document.getElementById('userSearchDropdown').classList.toggle('d-none')//hiding the dropdown
}

// i think its not used anywhere
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

export const defaultTheme = 'https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/patterns%2Fpattern%20(36).jpg?alt=media&token=66fa6c1d-4de8-4d33-8824-71095a0c8a4d';

// export async function updateUserDoc(db, id, newValue) {
//     const docRef = doc(db, "users", id);
//     await updateDoc(docRef, newValue);
// }


export async function acceptConnectionReq(db, userData, userName, dispatch) {
    console.log('acceptConnectionReq', userName)

    if (userData?.requests?.hasOwnProperty(userName)) {
        dispatch(showLoader(true));

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
        dispatch(showLoader(false));
        dispatch(setToast(`Request accepted`, false))
    }
}

export async function acceptGroupReq(db, userData, id, dispatch) {
    console.log('acceptGroupReq', id)

    if (userData?.requests?.hasOwnProperty(id)) {
        dispatch(showLoader(true));
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
        dispatch(showLoader(false));
    }
}

export async function declineConnectionReq(db, userData, userName, setSelectedUserToChat, dispatch) {
    console.log('declineConnectionReq', userName)

    //delete msgs here , don't remove from req list
    if (userData?.requests?.hasOwnProperty(userName)) {
        dispatch(showLoader(true));

        // delete userData.requests[userName];
        userData.requests[userName].deletedTill = serverTimestamp();

        //deleting connection req from req list 
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
        console.log('uddududuududud', userData)

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
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, email
            })
        })
        let data = await res.json()
        console.log('log', data)
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