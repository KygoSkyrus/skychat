import { addDoc, collection, doc, getFirestore, updateDoc } from "firebase/firestore"
import { useSelector } from "react-redux"

export const dbUsers = {
    "test1": {
        "connections": {},
        "username": "test1",
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2Favatar%20(8).png?alt=media&token=4c4b0ea3-519f-430c-9f0f-8c24df8d163c",
        "email": "test1@email.com",
        "requests": {
            "test2": {
                "deletedTill": {
                    "seconds": 1704961618,
                    "nanoseconds": 801000000
                },
                "id": "22e318c9-f125-4e07-9b14-1f74e9047eb2"
            }
        },
        "blockList": {},
        "time": {
            "seconds": 1704899512,
            "nanoseconds": 878000000
        },
        "id": "AMaRvZRYFUMabQKINmNF"
    },
    "test3": {
        "blockList": {},
        "time": {
            "seconds": 1705165774,
            "nanoseconds": 289000000
        },
        "requests": {},
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "email": "test3@email.com",
        "username": "test3",
        "connections": {},
        "id": "I5q047QCTEAgMowlYLBE"
    },
    "test2": {
        "requests": {},
        "avatar": "https://firebasestorage.googleapis.com/v0/b/shopp-itt.appspot.com/o/avatar%2FuserAvatar%20(6).png?alt=media&token=8fb50e10-daf9-402a-b020-65495494e14a",
        "connections": {
            "test1": {
                "id": "22e318c9-f125-4e07-9b14-1f74e9047eb2",
                "deletedTill": {
                    "seconds": 1705054641,
                    "nanoseconds": 802000000
                }
            }
        },
        "blockList": {},
        "time": {
            "seconds": 1704899556,
            "nanoseconds": 460000000
        },
        "username": "test2",
        "email": "test2@email.com",
        "id": "MSOGk7iP40CehhYW5x5I"
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



export async function writeToDb(db, msgObj) {
    try {
        const docRef = await addDoc(collection(db, "v2"), msgObj);
        //console.log("message send with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


export function hideSearchedUsersList(setSearchedUserList) {
    clearSearchList(setSearchedUserList)
    // document.getElementById('userSearchDropdown').classList.toggle('d-none')//hiding the dropdown
}

export const sidebarVisibility = (val, setSearchedUserList) => {
    let sidebar = document.getElementById("mySidebar");
    let overlay = document.querySelector('.overlay');

    if (val) {
        sidebar.style.display = "flex";
        overlay.classList.remove('d-none');
    } else {
        sidebar.style.display = "none";
        overlay.classList.add('d-none');

        clearSearchList(setSearchedUserList);
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



export async function updateUserDoc(db, id, newValue) {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, newValue);
}