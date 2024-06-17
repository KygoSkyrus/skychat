import React from 'react'
import { getExactTimeStr } from '../utils';
import { Trash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';

const MessageWrapper = ({ msgData, myself, isGroupSelected, setRefreshMessageList, setMessageList }) => {

  const firebaseApp = useSelector(state => state.firebase.firebaseApp)
  const userData = useSelector(state => state.user.userInfo)
  const db = getFirestore(firebaseApp);

  const deriveDate = (d) => {
    let date = new Date(d);
    return getExactTimeStr(date);
  }
  console.log('isGroupSelected', isGroupSelected)

  async function deleteMessage(id) {
    const msgDocRef = doc(db, "v2", id);
    const docSnap = await getDoc(msgDocRef);

    console.log('delete msg', docSnap.data())
    if (docSnap) {
      await updateDoc(msgDocRef, {
        deletedBy: [...docSnap.data()?.deletedBy, userData.username]
      });
    }
    // none of the below is working
    setRefreshMessageList(prev=>!prev)
    setMessageList(prev=>{
      console.log('prev',prev, docSnap.id)
      prev.map(x=> {
        console.log('xid',x.id)
        if(x.id === docSnap.id){
          x.deletedBy = [...docSnap.data()?.deletedBy, userData.username]
        }
      })
      console.log('after prev',prev)
      return prev;
    })
  }

  return (
    <>
      <div key={msgData.id} className={myself === msgData.author ? "msg-block me" : "msg-block other"} >

        {msgData?.deletedBy?.includes(msgData?.author) ?
          <span className='fs-12 deleted-msg'>Message deleted</span>
          :
          <>
            <section className="msg">
              {msgData.message}
            </section>

            <span className="msg-date">
              {typeof (msgData?.time) == 'object' ? getExactTimeStr(msgData?.time?.toDate()) : deriveDate(msgData?.time)}
            </span>

            <section className="msg-arrow"></section>
            <span className='msg-delete' onClick={() => deleteMessage(msgData.id)}>
              <Trash size={16} />
            </span>
          </>
        }
      </div>

      {/* we can remove the sender reciever name for one to one chat */}
      {isGroupSelected &&
        <section className={
          myself === msgData.author
            ? "authorName me"
            : "authorName other"
        }>{msgData.author}</section>
      }
    </>
  );
}

export default MessageWrapper