import React from 'react'

const MessageWrapper = ({msgData,me}) => {



    return (
        <>
        <div
          className={
            me.userID === msgData.from
              ? "msg-block me"
              : "msg-block other"
          }
          key={msgData.id}
        >
          <section className="msg">{msgData.message}</section>

          <span className="msg-date">{msgData.time?.toDate().getHours()+':'+msgData.time?.toDate().getMinutes()}</span>

          <section className="msg-arrow"></section>
        </div>
        <section className={
             me.userID === msgData.from
              ? "authorName me"
              : "authorName other"
          }>{msgData.author}</section>
        </>
      );
}

export default MessageWrapper