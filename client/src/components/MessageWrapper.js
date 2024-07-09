import React, { useContext } from 'react'
import { useSelector } from 'react-redux';
import { Trash } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { FirebaseContext } from '../firebaseContext';
import { deriveDate, getExactTimeStr } from '../utils';


const MessageWrapper = React.memo(({ msgData, myself, isGroupSelected, setMessageList }) => {

  const { db } = useContext(FirebaseContext);
  const userData = useSelector(state => state.user.userInfo)

  async function deleteMessage(id) {
    try {
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
    } catch (err) {
      console.log('something went wrong', err);
    }
  }

  return (
    <>
      <div key={msgData.id} className={myself === msgData.author ? "msg-block me" : "msg-block other"} >
        {msgData?.deletedBy?.includes(myself) ?
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

      {isGroupSelected && myself !== msgData.author &&
        <section className="authorName other">{msgData.author}</section>
      }
    </>
  );
});

export default MessageWrapper