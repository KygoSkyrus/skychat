import { collection, doc, getDoc, getDocs, getFirestore, updateDoc, where, query, serverTimestamp, onSnapshot } from 'firebase/firestore'
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
    const [memberList, setMemberList] = useState([])


    useEffect(() => {
        const docRef = doc(db, "group", selectedUserToChat);
        let groupMembers;
        const unsubscribe = onSnapshot(docRef, (doc) => {
            console.log("Document data:", doc.data());
            groupMembers = doc.data()?.members;
            setGroupInfo(doc.data());// setting basic info
            setInfo(groupMembers, doc.id); //handles group member's list
        });
        // get the group memebers name and by that fetch their avatar... save the data in localstoreage with the timesatamp..
        // now this function will only run if the timestamps of data in the locastorge is more than 2 or 3 hours ago        

        // snapshot cleanup
        return () => unsubscribe();
    }, [])

    async function setInfo(groupMembers, groupId) {
        let localGroupInfo = localStorage.getItem('groupInfo');
        console.log('localGroupInfo', localGroupInfo)

        let parsedInfo = {};
        if (localGroupInfo) {
            parsedInfo = JSON.parse(localGroupInfo);
        }

        // if there is already info stored 
        if (parsedInfo?.hasOwnProperty(groupId)) {
            console.log('ifff111', parsedInfo)
            // compare the unix times(in ms) with current time
            let lastUpdatedAt = parsedInfo[groupId].updatedAt;
            let currTime = new Date().getTime();
            console.log('time difff', ((currTime - lastUpdatedAt) / 60 / 1000))
            // if last updated before 6 hours than get fresh data  (the below equation returns time in min)
            if (((currTime - lastUpdatedAt) / 60 / 1000) > 360) {
                console.log('ifff222',parsedInfo[groupId]?.info)
                getAndSetFreshData();
            } else {
                console.log('ifff111else 22',parsedInfo[groupId]?.info)
                setMemberList(parsedInfo[groupId]?.info);
            }
        } else {
            console.log('elseeeee22',)
            // info needed to be added
            getAndSetFreshData();
        }

        // calling this only when the groupInfo is not availalble or when the info is outdate(more than 6hrs old)
        async function getAndSetFreshData(){
            let info = await getGroupInfo(groupMembers);
            let data = {
                info,
                updatedAt: new Date().getTime(),
            }

            // appending the group info in localstorage
            parsedInfo[groupId] = data;
            localStorage.setItem('groupInfo', JSON.stringify(parsedInfo))
            setMemberList(parsedInfo[groupId]?.info)
        }
    }

    async function getGroupInfo(groupMembers) {
        let info = [];
        for (let x of groupMembers) {
            let q = query(collection(db, "users"), where("username", "==", x.name));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                info.push({ name: x.name, avatar: doc.data()?.avatar });
            });
        }
        console.log('info', info)
        return info;
    }

    const removeMember = async (userName) => {
        // here you remove this user from the group collection
        // and remove the group from user's collection or group..wherever the group is avaialble

        // NOTE: ONLY ADMIN CAN REMOVE A MEMBER
        if (userData.username !== groupInfo?.createdBy) {
            dispatch({ type: SET_TOAST, payload: { toastContent: "Only group admin can perform this action", isError: true } });
            return;
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


    // [done]..have  to delete the self from group collections too when a user is removed and exits volunteeraly
    // [done]..for adding members in group  mdoal ,, things you have to do is send a msg to group that user has added,, same goes when a member is removed
    // [done]..second important thing is that u need to check if the msg if recieved by the members only,, not by the removed members 
    // [done]..user cant add more than 25 members in group
    // [done]..when user leaves it should show right than in the groupmemberlist,,,can we do something like this that if we are groupinfo page and right then if someone leaves,,,we see the chnage in member list,,, can add a snapshot for groupinfo,,,maybe that will work in real time
    // [done]on add member modal its showing create group at the top 

    // CASE:?? if the admin leaves than there is no admin, hence no members can be added.. possible solution>> is to have createdBy as an array.. which initailly will have one(creator) user.. and if that user leaves than push the next member from memberlist to that array,, this array will be like stack,, the top user is the current admin,,,and the first ever user will be the creator. 

    //ADDED:> when a user is added to group by admin(using btn in groupinfo after the group has been already created),, than a deletedTill value should be added in user's doc so that he can see the chats after he has joined(not the previous one)
    //REMOVE:> when a user is removed than first he will be removed from the group collection,, and than the exitAt date will me added to group connection 
    // GROUP has basicalaly three actions,, 
    // accept; which means user accespts to be in group,, [avaiallabe in req list]
    // delete; means the user exits the group... [this is avaiallabe in both connection and req list]
    // clearChat; means the chat is cleared... [ avaialable in connection list only]
    // Add/remove member: only admin can perfrom this action( let this action be displayed but throw a notifiction if anyone other than admin tries to perform these actions)

    // first when a user is removed from group or he leaves himself than the chat should not disappear ,,as it should show the group but messaging should be disabled.... (if this is time taking than leave it).... [solution]this can be done by adding a key the users connection list of that group,,along with groupname and connection-id,, a key of exitAt should be added on removal of group of when leaving instead of deleting the group connection..by this key we will hide and show the text input  field on chat window.. if this key is there than hide the input as the user is no longer a member,,, and when user is added again,,it will be check if the user already has the group connection id(bcz there might be a case that user has cleared the chat),,,if yes than this key will be deleted and everything will be same as usual... also note that when this key is avaialbe than it  should not show the exit group button to user

    // when there is exitAt key than show delete group button else show exit group,, delete group btn will delete the group connection from list,  even if user does not delete the group after exiting the group,, than when he is added again it should be checked if he has that group connection already than first the connection should be moved to req list,, second check if deletedTill is after the exitAt(to check if user has cleared that chats of group after exit),,  if yes than we will update the deletedTill( deletedTill here is refered to as the joining time) so that user sees the new msgs only and if no than we will let the deletedTill be as it is so the user will get to have his previous msgs
    // CASE: we have to update the deletedTill(joining time) bcz there may be msgs in group between the period when user has left and when he is added again,,, and if we dont update the deletedTill than user can see the msgs from that period too(which is wrong)
    // CASE: if a person is added in group and that person hasnt accepted the group req and the req is still in req list while he is removed from grooup,, then unlike being in connection list the group connection will be deleted from req list

    // if user exit/removed from group and when he is added again then msgs are not showing in realtime,, if he reopens the chat than its working,, this may be bcz of the condiion if exitAT


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
                            memberList?.map(x => (
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
                        memberList={memberList}
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