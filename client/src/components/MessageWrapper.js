import React from 'react'
import { getExactTimeStr } from '../utils';

const MessageWrapper = ({ msgData, myself }) => {

  const deriveDate = (d) => {
    let date = new Date(d);
    return getExactTimeStr(date);
  }

  return (
    <>
      <div
        className={
          myself === msgData.author
            ? "msg-block me"
            : "msg-block other"
        }
        key={msgData.id}
      >
        <section className="msg">
          {msgData.message}
        </section>

        <span className="msg-date">
          {typeof (msgData?.time) == 'object' ? getExactTimeStr(msgData?.time?.toDate()) : deriveDate(msgData?.time)}
        </span>

        <section className="msg-arrow"></section>
      </div>

      {/* we can remove the sender reciever name for one to one chat */}
      <section className={
        myself === msgData.author
          ? "authorName me"
          : "authorName other"
      }>{msgData.author}</section>
    </>
  );
}

export default MessageWrapper