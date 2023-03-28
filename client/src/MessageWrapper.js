import React from 'react'

const MessageWrapper = (props) => {

    const [mesgContent,me]=props


    return (
        <>
        <div
          className={
            me.userID === mesgContent.from
              ? "msg-block me"
              : "msg-block other"
          }
          key={mesgContent.id}
        >
          <section className="msg">{mesgContent.message}</section>

          <span className="msg-date">{mesgContent.time?.toDate().getHours()+':'+mesgContent.time?.toDate().getMinutes()}</span>

          <section className="msg-arrow"></section>
        </div>
        <section className={
             me.userID === mesgContent.from
              ? "authorName me"
              : "authorName other"
          }>{mesgContent.author}</section>
        </>
      );
}

export default MessageWrapper