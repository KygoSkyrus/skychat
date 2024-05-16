import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { ArrowLeft, Edit, LogOut, MessageSquareX, UserRoundPlus, Users, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDateStr, getExactTimeStr, getFullDateStr, getLocalDateStr } from '../../utils'


const EntityInfoModal = ({ setShowEntityInfoModal, selectedUserToChat, selectedGroupName }) => {

    const userData = useSelector(state => state.user.userInfo)
    const firebaseApp = useSelector(state => state.firebase.firebaseApp)// use this firebaseapp everywhere instead of passing it as prop
    const db = getFirestore(firebaseApp);

    const [groupInfo, setGroupInfo] = useState();

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
                            <span title="Add member" className='pointer'>
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
                                        <span>{x.name}</span>
                                    </section>
                                    <section className="blockConnection"
                                        // onClick={() => exitGroup(x, setSelectedUserToChat)} 
                                        title="Kick out">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                    </section>
                                </div>
                            )
                            )}
                        </div>


                    </div>

                </div>
            </div>
        </>
    )
}

export default EntityInfoModal