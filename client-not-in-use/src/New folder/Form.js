import React from 'react';

const Form = ({ title, setPassword, setEmail,setdisplayName, handleAction }) => {

  return <div>
<h3>{title}</h3>
<input type="email"  placeholder="email" id="email" label="Enter the Email" onChange={(e) => setEmail(e.target.value)}/>
  <input type="text" placeholder="username" id="username" label="username" onChange={(e)=>setdisplayName(e.target.value)} />
<input type="password" placeholder="pswrd" id="password" label="Enter the Password" onChange={(e) => setPassword(e.target.value)} />

<button onClick={handleAction}>{title}</button>
  </div>;
};

export default Form;
