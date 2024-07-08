import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, X, Check } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid';

import SearchComponent from '../SearchComponent'
import { FirebaseContext } from '../../firebaseContext';
import { collection, query, where, doc, getDocs, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { setToast, showAddMemberModal, showGroupModal, showLoader } from '../../redux/actionCreators';
import { writeToDb } from '../../utils';

const GroupModal = ({ handleSelectedUserToChat, type, groupInfo, setGroupInfo }) => {

    const dispatch = useDispatch();
    const { db } = useContext(FirebaseContext);
    const userData = useSelector(state => state.user.userInfo)
    const usersList = useSelector(state => state.user.usersList); // all the existing users in the db
    const isGroupModalVisible = useSelector((state) => state.ui.isGroupModalVisible);
    const isAddMemberModalVisible = useSelector((state) => state.ui.isAddMemberModalVisible);

    const [selectedUsersForGroup, setSelectedUsersForGroup] = useState([])
    const [firstPage, setFirstPage] = useState(type !== "add_member");
    const [groupName, setGroupName] = useState('');


    const createGroup = async () => {
        if (groupName) {
            dispatch(showLoader(true));

            let connectionId = uuidv4();
            const members = [];

            const userDocRef = doc(db, "users", userData.id);
            await updateDoc(userDocRef, {
                connections: {
                    ...userData.connections,
                    [connectionId]: {
                        id: connectionId,
                        groupName,
                    },
                }
            });

            let receiversDoc = [];
            for (let x of selectedUsersForGroup) {
                let q = query(collection(db, "users"), where("username", "==", x));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    let temp = { ...doc.data(), id: doc.id }
                    receiversDoc.push(temp)
                    members.push({ name: temp.username, avatar: temp.avatar })
                });
            }

            //updating the receiver document request list
            for (let i = 0; i < receiversDoc?.length; i++) {
                const receiverDocRef = doc(db, "users", receiversDoc[i]?.id);
                await updateDoc(receiverDocRef, {
                    requests: {
                        ...receiversDoc[i]?.requests,
                        [connectionId]: {
                            id: connectionId,
                            groupName,
                            deletedTill: serverTimestamp(),
                        },
                    }
                });

                // SENDING NOTIFICATION (USER ADDED)
                const msgData = {
                    connectionId,
                    author: userData?.username,
                    message: `${userData?.username} added ${receiversDoc[i]?.username}`,
                    time: serverTimestamp(),
                    isNotification: true,
                    type: "added",
                };
                await writeToDb(db, msgData);
            }

            //adding the creator to the member list
            members.push({ name: userData?.username, avatar: userData?.avatar })
            // creating document in group collection with same id as of groupId (has group details)
            await setDoc(doc(db, "group", connectionId), {
                id: connectionId,
                groupName,
                members,
                createdBy: userData?.username,
                createdAt: serverTimestamp(),
            });

            setGroupName(''); // resetting input text field
            dispatch(showGroupModal(false))// hiding modal
            handleSelectedUserToChat(connectionId, groupName);
            dispatch(showLoader(false));
        }
    }


    const handleSelectedGroupMember = (member) => {

        // prevent user from added blocked connections
        if (userData?.blockList.hasOwnProperty(member)) {
            dispatch(setToast(`Selected user is blocked. Unblock to add in group`, true))
            return;
        }

        // only 25 members can be added while creating a group
        if (selectedUsersForGroup.length >= 25) {
            dispatch(setToast(`Group can not have more than 3 members`, true))
            return;
        }

        // checks if user is already selected
        if (selectedUsersForGroup.includes(member)) {
            dispatch(setToast(`User already selected`, true))
            return;
        }

        if (groupInfo?.members) {
            if (groupInfo?.members?.length + selectedUsersForGroup.length >= 25) {
                dispatch(setToast(`Group can not have more than 3 members`, true))
                return;
            }
            // check if user is already a member
            for (let i = 0; i < groupInfo?.members?.length; i++) {
                if (groupInfo?.members[i]?.name === member) {
                    dispatch(setToast(`User is already a member`, true))
                    return;
                }
            }
        }
        setSelectedUsersForGroup(prev => [...prev, member])
    }


    const addMember = async () => {
        if (selectedUsersForGroup) {
            dispatch(showLoader(true));
            const members = [];// array of objects of member and their avatar

            let receiversDoc = [];
            for (let x of selectedUsersForGroup) {
                let q = query(collection(db, "users"), where("username", "==", x));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    let temp = { ...doc.data(), id: doc.id }
                    receiversDoc.push(temp)
                    members.push({ name: temp.username, avatar: temp.avatar })
                });
            }

            //updating the receiver document request list
            for (let x of receiversDoc) {
                const receiverDocRef = doc(db, "users", x.id);

                await updateDoc(receiverDocRef, {
                    requests: {
                        ...x.requests,
                        [groupInfo?.id]: {
                            id: groupInfo?.id,
                            groupName: groupInfo?.groupName,
                            deletedTill: serverTimestamp(),
                        },
                    }
                });

                // SENDING NOTIFICATION (USER ADDED)
                const msgData = {
                    connectionId: groupInfo?.id,
                    author: groupInfo?.createdBy,
                    message: `${groupInfo?.createdBy} added ${x?.username}`,
                    time: serverTimestamp(),
                    isNotification: true,
                    type: "added",
                };
                await writeToDb(db, msgData);
            }

            // UPDATING GROUP TO WITH NEW MEMBERS
            const docRef = doc(db, "group", groupInfo?.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let data = docSnap.data();
                let newMemberList = [...data.members, ...members]
                data.members = newMemberList;

                await updateDoc(docRef, data);
                setGroupInfo(data);
                dispatch(showAddMemberModal(false));
            }
            dispatch(showLoader(false));
        }
    }

    const handleContinue = (e) => {
        e.preventDefault();
        setFirstPage(false)
    }

    if (type === "add_member" && !isAddMemberModalVisible) return null;
    if (type === "create_group" && !isGroupModalVisible) return null;

    return (
        <>
            <div className="zIndex6" id="groupModal" >
                <div className="m-dialog bg-dark">

                    <div className='d-flex align-items-center justify-content-between bg-dark p-3 text-white br-12'>
                        <ArrowLeft size="20" className='text-secondary pointer' onClick={() => type === "add_member" ? dispatch(showAddMemberModal(false)) : dispatch(showGroupModal(false))} />
                        <span className={`text-secondary fs-12`} >{type === "add_member" ? 'Add Member' : 'Create Group'}</span>
                        {/* <X size="20" className='btn-close' onClick={() => setShowGroupModal(false)} /> */}
                    </div>

                    {firstPage ?
                        <div className='p-4'>
                            <form onSubmit={e => handleContinue(e)} className='d-flex flex-column gap-2'>
                                <label>Enter group name</label>
                                <input type='text' className='p-2 px-3 rounded-4' value={groupName} onChange={e => setGroupName(e.target.value)} placeholder='enter group name' required />
                                <button type='submit' className='p-2 rounded-4' >CONTINUE</button>
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
                            />

                            {selectedUsersForGroup.length > 0 &&
                                <section className='pointer bold rounded-3 d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px", position: "absolute", bottom: "16px", right: "16px", background: "#0783be", boxShadow: "0 0 10px #0783be96" }} onClick={type === "add_member" ? addMember : createGroup}>
                                    <Check size={20} strokeWidth={4} />
                                </section>
                            }
                        </>
                    }

                </div>
            </div>
            <div className="overlay pointer zIndex5" onClick={() => type === "add_member" ? dispatch(showAddMemberModal(false)) : dispatch(showGroupModal(false))}></div>
        </>
    )
}

export default GroupModal