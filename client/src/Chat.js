import React,{useState,useEffect} from 'react'

const Chat = ({socket,username,room}) => {


  const [currentMsg, setcurrentMsg] = useState('');
  const [msgList, setmsgList] = useState([]);

  const sendMsg=async()=>{
    if(currentMsg!==''){
      const msgData={
        room:room,
        author:username,
        message:currentMsg,
        time:new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes(),
      };
      await socket.emit('sendMessage',msgData);
      setmsgList((list)=>[...list,msgData])//for seeting the msg we send in our screen too,,without this the mesg will be not shown in our screen 
      setcurrentMsg('')//clearing msg from input field
    }
     
  }
  //add scrolltobittom in chat messages

  useEffect(() => {
     
  socket.on('recieveMsg',(data)=>{
    console.log(data)
    setmsgList((list)=>[...list,data])//for adding the mesg in list(the list parameter is what whicxh have all the previous msgs and the the new msg whhich is 'data' will be added )
  })
  }, [socket])
  


  return (
    <div className='bg-light p-3'>
      <h3>/.../</h3>
      <div className='bg-primary p-2 position-relative'>
        {msgList.map((mesgContent)=>{
          //bcz u r using username to distinguis the two clients if both the username are same thgen it will not be able to  differnetiate 
          return <span className={username===mesgContent.author? "me msg":"other msg"}  key={mesgContent.message}>{mesgContent.message}</span>
        })}
      </div>
      <input type='text' name="msg" onChange={e => setcurrentMsg(e.target.value)} value={currentMsg} placeholder='room' className="my-1" onKeyPress={e=>e.key==="Enter"&&sendMsg()} />
          <button onClick={sendMsg} >send</button>

    </div>
  )
}

export default Chat