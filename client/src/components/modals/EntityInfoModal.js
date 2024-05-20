import { collection, doc, getDoc, getDocs, getFirestore, updateDoc, where, query, serverTimestamp } from 'firebase/firestore'
import { ArrowLeft, Edit, LogOut, MessageSquareX, UserRoundPlus, Users, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { exitGroup, getDateStr, getExactTimeStr, getFullDateStr, getLocalDateStr, writeToDb } from '../../utils'
import GroupModal from './GroupModal'
import { SET_TOAST } from '../../redux/actionTypes'


const EntityInfoModal = ({ setShowEntityInfoModal, selectedUserToChat, selectedGroupName, searchedUserList, setSearchedUserList }) => {

    const dispatch = useDispatch();

    const userData = useSelector(state => state.user.userInfo)
    const firebaseApp = useSelector(state => state.firebase.firebaseApp)// use this firebaseapp everywhere instead of passing it as prop
    const db = getFirestore(firebaseApp);

    const [groupInfo, setGroupInfo] = useState();

    const [showGroupModal, setShowGroupModal] = useState(false)


    useEffect(() => {
        getGroupInfo();
    }, [])

    const getGroupInfo = async () => {
        const docRef = doc(db, "group", selectedUserToChat);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setGroupInfo(docSnap.data());
        }
    }

    const removeMember = async (userName) => {
        // here you remove this user from the group collection
        // and remove the group from user's collection or group..wherever the group is avaialble

        // NOTE: ONLY ADMIN CAN REMOVE A MEMBER
        if (userData.username !== groupInfo?.createdBy) {
            dispatch({ type: SET_TOAST, payload: { toastContent: "Only group admin can perform this action", isError: true } })
            return;
        }

        //removing member from group list 
        const docRef = doc(db, "group", selectedUserToChat);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            let data = docSnap.data();
            let newMemberList = data.members.filter(x => x.name !== userName)
            data.members = newMemberList;

            await updateDoc(docRef, data);// updating document
            setGroupInfo(data);
        }

        // deleting group from user's connection/req list 
        console.log('username', userName)
        let q = query(collection(db, "users"), where("username", "==", userName));
        const querySnapshot = await getDocs(q);
        let receiverDoc;
        querySnapshot?.forEach((doc) => {
            // console.log("RECIEVEER'S DOC => ", doc.data());
            receiverDoc = doc.data()
            receiverDoc.id = doc.id;
            return;
        });
        await exitGroup(db, receiverDoc, selectedUserToChat, false, true)

        // SENDING NOTIFICATION (USER removed)
        const msgData = {
            connectionId: selectedUserToChat,
            author: userData?.username,
            message: `${userData?.username} removed ${userName}`,
            time: serverTimestamp(),
            isNotification: true,
            type: "removed",
        };
        await writeToDb(db, msgData);

    }

    const handleAddMember = () => {
        // NOTE: ONLY ADMIN CAN ADD A MEMBER
        if (userData.username !== groupInfo?.createdBy) {
            dispatch({ type: SET_TOAST, payload: { toastContent: "Only group admin can perform this action", isError: true } })
        } else {
            setShowGroupModal(true);
        }
    }

    // NEXT>> work on clearchat in group, and check the msgs are showing in correct chronology

    // done..have  to delete the self from group collections too when a user is removed and exits volunteeraly
    // when group is created,,,send a msg too that you have created this group
    // for adding members in group  mdoal ,, things you have to do is send a msg to group that user has added,, same goes when a member is removed
    // second important thing is that u need to check if the msg if recieved by the members only,, not by the removed members 
    // in the commection or req list for qruop,, every individual should have saved time when they have jpined or added to group
    //ADDED:> when a user is added to group (using btn in groupinfo),, after the group has been already created,, than a chatstill value should be added in user's doc so that he can see the chats after he has joined(not the previous one)
    //REMOVE:> when a user is removed than first he will be remived from the group collection,, and than the group will me deleted from connection list 
    // GROUP has basicalaly three actions,, 
    // accept; which means user accespts to be in group,, [avaiallabe in req list]
    // delete; means the user exits the group... [this is avaiallabe in both connection and req list]
    // clearChat; means the chat is cleared... [ avaialable in connection list only]
    // Add/remove member: only admin can perfrom this action( let this action be displayed but throw a notifiction if anyone other than admin tries to perform these actions)
    // when user leaves it should show right than in the groupmemberlist,,,
    // when members are added to group on group creation or later,,, tha deletetill timestamp is added to show the chats of group only since the user has joined
    //when a member leaves or joins a group.,, it should reflect right away
    // when user accepst the req list,,, than when user clicks on ddropdown on top right ,, than  it still throws error ,, maybe it thinks that we are still on request tab
    // {still a problem} - notification is not going for all members

    return (
        <>
            <div className="" id="entityInfoModal" >
                <div className="m-dialog justify-content-center bg-dark rounded-1">

                    <div className='d-flex align-items-center justify-content-between'>
                        <X size="20" className='btn-close' onClick={() => setShowEntityInfoModal(false)} />
                        {/* <ArrowLeft size="20" className='text-secondary '  onClick={() => setShowUserModal(false)} />
                        <span className='text-secondary fs-12'>Profile</span> */}
                    </div>


                    <div className="d-flex align-items-center justify-content-center flex-column text-light h-100 py-4 px-4 entityInfoOver">
                        <div className='uImg'>
                            <Users size={30} />
                        </div>

                        <section className='uname mt-2'>{selectedGroupName}</section>
                        <section className='email fs-10 text-secondary'>Created by {groupInfo?.createdBy} at {getLocalDateStr(groupInfo?.createdAt)}</section>


                        <div className='mt-3 w-100 member_heading'>
                            Group members
                            <span title="Add member" className='pointer' onClick={() => handleAddMember()}>
                                <UserRoundPlus size={18} />
                            </span>
                        </div>

                        <div className="member_list w-100">{
                            groupInfo?.members?.map(x => (
                                <div className="list" key={x.name}>
                                    <section className="chat_list_item"
                                    //  onClick={() => handleSelectedUserToChat(x, userData?.connections[x]?.groupName || false)} 
                                    >
                                        <img src={x.avatar} className="me-2" alt="" />
                                        <div>
                                            <span>{x.name}</span>
                                            {x.name === groupInfo?.createdBy &&
                                                <section className='fs-10' style={{ color: 'var(--green)', lineHeight: "8px" }}>Admin</section>
                                            }
                                        </div>
                                    </section>
                                    {x.name !== userData.username &&
                                        <section className="blockConnection"
                                            onClick={() => removeMember(x.name)}
                                            title="Kick out">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-x"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                        </section>
                                    }
                                </div>
                            )
                            )}
                        </div>


                    </div>

                </div>
            </div>

            {showGroupModal &&
                <>
                    <GroupModal
                        setShowGroupModal={setShowGroupModal}
                        // handleSelectedUserToChat={handleSelectedUserToChat}
                        searchedUserList={searchedUserList}
                        setSearchedUserList={setSearchedUserList}
                        type="add_member"
                        memberList={groupInfo?.members}
                        groupInfo={groupInfo}
                        setGroupInfo={setGroupInfo}
                    />
                    {/* <div className="overlay pointer zIndex4" onClick={() => setShowGroupModal(false)}></div> */}
                </>
            }
        </>
    )
}

export default EntityInfoModal