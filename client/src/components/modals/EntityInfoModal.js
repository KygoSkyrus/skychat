import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { collection, doc, getDocs, where, query, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { UserRoundPlus, Users, X } from 'lucide-react'

import GroupModal from './GroupModal'
import { FirebaseContext } from '../../firebaseContext'
import { exitGroup, getLocalDateStr, writeToDb } from '../../utils'
import { setToast, showAddMemberModal, showConfirmationModal, showEntityInfoModal, showLoader } from '../../redux/actionCreators'


const EntityInfoModal = React.memo(({ selectedUserToChat, selectedGroupName }) => {

    const dispatch = useDispatch();
    const { db } = useContext(FirebaseContext);

    const userData = useSelector(state => state.user.userInfo)
    const [groupInfo, setGroupInfo] = useState();

    useEffect(() => {
        const docRef = doc(db, "group", selectedUserToChat);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            setInfo(doc.data(), doc.id); //handles group member's list
        });

        return () => unsubscribe(); // snapshot cleanup
    }, [selectedUserToChat])


    async function setInfo(data, groupId) {
        let localGroupInfo = localStorage.getItem('groupInfo');

        let parsedInfo = {};
        if (localGroupInfo) {
            parsedInfo = JSON.parse(localGroupInfo);
        }

        // if there is already info stored 
        if (parsedInfo?.hasOwnProperty(groupId)) {
            // compare the unix times(in ms) with current time
            let lastUpdatedAt = parsedInfo[groupId].updatedAt;
            let currTime = new Date().getTime();

            // if last updated before 6 hours than get fresh data  (the below equation returns time in min)
            if (((currTime - lastUpdatedAt) / 60 / 1000) > 360) {
                getAndSetFreshData();
            } else {
                data?.members?.forEach(x => {
                    if (parsedInfo[groupId]?.info?.hasOwnProperty(x.name)) {
                        x.avatar = parsedInfo[groupId]?.info[x.name];
                    }
                })
                setGroupInfo(data);
            }
        } else {
            // info needed to be added
            getAndSetFreshData();
        }

        // calling this only when the groupInfo is not available or when info is outdated(more than 6hrs old)
        async function getAndSetFreshData() {
            let info = await getGroupInfo(data?.members);
            let infoData = {
                info,
                updatedAt: new Date().getTime(),
            }

            parsedInfo[groupId] = infoData; // appending the group info in localstorage
            localStorage.setItem('groupInfo', JSON.stringify(parsedInfo))
            data?.members?.forEach(x => {
                if (parsedInfo[groupId]?.info?.hasOwnProperty(x.name)) {
                    x.avatar = parsedInfo[groupId]?.info[x.name];
                }
            })
            setGroupInfo(data);
        }
    }

    async function getGroupInfo(groupMembers) {
        let info = {};
        for (let x of groupMembers) {
            let q = query(collection(db, "users"), where("username", "==", x.name));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                info[x.name] = doc.data()?.avatar;
            });
        }
        return info;
    }

    const removeMember = async (userName) => {
        // NOTE: ONLY ADMIN CAN REMOVE A MEMBER
        if (userData.username !== groupInfo?.createdBy) {
            dispatch(setToast(`Only group admin can perform this action`, true))
            return;
        }

        dispatch(showLoader(true));

        // deleting group from user's connection/req list 
        let q = query(collection(db, "users"), where("username", "==", userName));
        const querySnapshot = await getDocs(q);
        let receiverDoc;
        querySnapshot?.forEach((doc) => {
            receiverDoc = { ...doc.data(), id: doc.id };
            return;
        });
        await exitGroup(dispatch, db, receiverDoc, selectedUserToChat, false, true)

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
        dispatch(showLoader(false));
    }

    const handleAddMember = () => {
        // NOTE: ONLY ADMIN CAN ADD A MEMBER
        userData.username !== groupInfo?.createdBy ?
            dispatch(setToast(`Only group admin can perform this action`, true)) :
            dispatch(showAddMemberModal(true))
    }

    return (
        <>
            <div className="" id="entityInfoModal" >
                <div className="m-dialog justify-content-center bg-dark">

                    <div className='d-flex align-items-center justify-content-between'>
                        <X size="20" className='btn-close' onClick={() => dispatch(showEntityInfoModal(false))} />
                    </div>

                    <div className="d-flex align-items-center justify-content-center flex-column text-light h-100 py-4 px-4 entityInfoOver">
                        <div className='uImg'>
                            <Users size={30} />
                        </div>

                        <section className='uname mt-2'>{selectedGroupName}</section>
                        <section className='email fs-10 text-secondary'>
                            Created by {groupInfo?.createdBy} at {getLocalDateStr(groupInfo?.createdAt)}
                        </section>

                        <div className='mt-3 w-100 member_heading'>
                            Group members
                            <span title="Add member" className='pointer' onClick={() => handleAddMember()}>
                                <UserRoundPlus size={18} />
                            </span>
                        </div>

                        <div className="member_list w-100">
                            {groupInfo?.members ?
                                groupInfo?.members?.map(x => (
                                    <div className="list" key={x.name}>
                                        <section className="chat_list_item" >
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
                                                onClick={() => dispatch(showConfirmationModal(`Are you sure you want to kick <code>${x.name}</code> out of group?`, () => removeMember(x.name)))}
                                                title="Kick out">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-x"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                            </section>
                                        }
                                    </div>
                                ))
                                :
                                <div className="custom-loader my-3"></div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <GroupModal
                type="add_member"
                groupInfo={groupInfo}
                setGroupInfo={setGroupInfo}
            />
        </>
    )
})

export default EntityInfoModal