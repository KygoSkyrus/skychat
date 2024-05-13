import { ArrowLeft, Edit, X, Check } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SearchComponent from '../SearchComponent'
import { SET_CURRENT_USER, SET_TOAST } from '../../redux/actionTypes';
import { v4 as uuidv4 } from 'uuid';


import { getFirestore, collection, query, where, doc, orderBy, getDocs, getDoc, addDoc, setDoc, serverTimestamp, toDate, limit, updateDoc, onSnapshot, Timestamp, startAfter, } from "firebase/firestore";

const GroupModal = ({ setShowGroupModal, handleSelectedUserToChat, searchedUserList, setSearchedUserList }) => {

    const dispatch = useDispatch();

    const userData = useSelector(state => state.user.userInfo)
    const usersList = useSelector(state => state.user.usersList); // all the existing users in the db
    const firebaseApp = useSelector(state => state.firebase.firebaseApp)

    const [selectedUsersForGroup, setSelectedUsersForGroup] = useState([])
    const [firstPage, setFirstPage] = useState(true);
    const [groupName, setGroupName] = useState('');

    const db = getFirestore(firebaseApp);
    console.log('ud',userData)


    // on creating group user can add any user by searcing the user name
    // there will be modal.. first there will be a  text box to enter username then when user click on search to search,,, it is exactly like search on sidebar
    // next below that there will be all the users in the connection list(maybe show req list or blocked connection too but then before adding them user has to unlock or approve his reuqest)
    //you can also show the slected users on the top 

    const createGroup = async () => {

        // let connectionId;
        if (groupName) {
            let connectionId = uuidv4(); // creating a new connection id

            const userDocRef = doc(db, "users", userData.id);
            // updating the user document with new connection in connection list
            // initailly add past time like 1970 in deltedTill
            await updateDoc(userDocRef, {
                connections: {
                    ...userData.connections,
                    [connectionId]: {
                        id: connectionId,
                        groupName,
                        // members:selectedUsersForGroup,
                        // isGroup:true,
                    },
                }
            });

            // getting receiver's doc
            let receiversDoc=[];
            for(let x of selectedUsersForGroup){
            // selectedUsersForGroup.map(async x=>{
                let q = query(collection(db, "users"), where("username", "==", x));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    // console.log("RECIEVEER'S DOC => ", doc.data());
                    let temp;
                    temp = doc.data()
                    temp.id = doc.id;
                    receiversDoc.push(temp)
                    // return;
                });
            // })
            }
            console.log('receiversDoc',receiversDoc)

            //updating the receiver document request list
            for(let x of receiversDoc){
                console.log("x",x)
            // receiversDoc.map(async x=>{
                const receiverDocRef = doc(db, "users", x.id);
                await updateDoc(receiverDocRef, {
                    requests: {
                        ...receiversDoc.requests,
                        [connectionId]: {
                            id: connectionId,
                            groupName,
                            // members:selectedUsersForGroup,
                        },
                    }
                });
            // })
            
            //adding the creator to the member list
            const members=[...selectedUsersForGroup];
            members.push(userData?.username);
            // creating document in group collection with same id as of groupId (has group details)
            await setDoc(doc(db, "group", connectionId), {
                groupName,
                members,
                createdBy: userData?.username,
                createdAt: serverTimestamp(),
              });
        }

            // calling the realtimeListener for initial msg, bcz for first msg when user is selected to chat up untill then there is no connection id, so onsnapshot does not work when msg is sent and needs a refresh
            // realtimeListener(selectedUserToChat, connectionId)

            setGroupName(''); // resetting input text field
        }
    }


    const handleSelectedGroupMember = (member) => {
        if (selectedUsersForGroup.includes(member)) {
            dispatch({ type: SET_TOAST, payload: { toastContent: "User already exists", isError: true } })
        } else {
            setSelectedUsersForGroup(prev => [...prev, member])
        }
    }

    const handleContinue = (e) => {
        e.preventDefault();
        setFirstPage(false)
    }




    return (
        <>
            <div className="" id="groupModal" >
                <div className="m-dialog bg-dark rounded-1">

                    <div className='d-flex align-items-center justify-content-between bg-dark p-3 text-white'>
                        <ArrowLeft size="20" className='text-secondary pointer' onClick={() => setShowGroupModal(false)} />
                        <span className={`text-secondary fs-12`} >Create Group</span>
                        {/* <X size="20" className='btn-close' onClick={() => setShowGroupModal(false)} /> */}
                    </div>

                    {firstPage ?
                        <div className='p-4'>
                            <form onSubmit={e => handleContinue(e)} className='d-flex flex-column gap-2'>
                                <label>Enter group name</label>
                                <input type='text' className='rounded-4' value={groupName} onChange={e => setGroupName(e.target.value)} placeholder='enter group name' required />
                                <button type='submit' className='rounded-4' >continue</button>
                            </form>
                        </div>
                        :
                        <>
                            <div className='groupMembers d-flex bg-secondary overflow-auto'>
                                {selectedUsersForGroup?.map(x =>
                                    <section className="selectedMember position-relative d-flex flex-column pointer p-1 px-2" key={x} onClick={() => setSelectedUsersForGroup(prev => prev.filter(y => y !== x))} >
                                        <img src={usersList[x]?.avatar} className='position-relative' alt="" width="35px" height="35px" />
                                        <X size="20" />
                                        <span className='fs-12 text-center'>{x}</span>
                                    </section>
                                )
                                }
                            </div>


                            <SearchComponent
                                id={"userSearchDropdownGroup"}
                                handleSelectedGroupMember={handleSelectedGroupMember}
                                searchedUserList={searchedUserList}
                                setSearchedUserList={setSearchedUserList}
                            />

                            {selectedUsersForGroup.length > 0 &&
                                <section className='pointer bold bg-success rounded-3 d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px", position: "absolute", bottom: "16px", right: "16px" }} onClick={createGroup}>
                                    <Check size={20} strokeWidth={4} />
                                </section>
                            }
                        </>
                    }

                </div>
            </div>
        </>
    )
}

export default GroupModal