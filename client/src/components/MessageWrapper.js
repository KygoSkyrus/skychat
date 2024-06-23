import React, { useContext } from 'react'
import { getExactTimeStr } from '../utils';
import { Trash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { FirebaseContext } from '../firebaseContext';

const MessageWrapper = React.memo(({ msgData, myself, isGroupSelected, setMessageList }) => {

  const userData = useSelector(state => state.user.userInfo)
  // const firebaseApp = useSelector(state => state.firebase.firebaseApp)
  // const db = getFirestore(firebaseApp);
  const { firebaseApp, db } = useContext(FirebaseContext);


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

    setMessageList(prev => {
      return prev.map(x => {
        if (x.id === id) {
          return { ...x, deletedBy: [...x.deletedBy, userData.username] }
        }
        return x;
      })
    })
  }

  return (
    <>
      <div key={msgData.id} className={myself === msgData.author ? "msg-block me" : "msg-block other"} >

        {/* {msgData?.deletedBy?.includes(msgData?.author) ? (for v3) */}
        {msgData?.deletedBy?.includes(myself) ?
          // <span className='fs-12 deleted-msg'>Message deleted by you</span>
          <span className='fs-12 deleted-msg'><small>You deleted this message</small></span>
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
      {isGroupSelected && myself !== msgData.author &&
        <section className="authorName other">{msgData.author}</section>
      }
    </>
  );
});

export default MessageWrapper