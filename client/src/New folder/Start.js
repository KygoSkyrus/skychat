import React from 'react'
import {
   Link
  } from "react-router-dom" ;
const Start = () => {

  console.log(sessionStorage.getItem('Auth Token'))

  return (
    <div>GET Started

<br/>
<Link to="/login"><button className="p-2 m-1 btn btn-outline-dark"> login </button></Link>
<br/>
<Link to="/register"><button className="p-2 m-1 btn btn-outline-dark">register</button></Link>
<br/>
<Link to="/google"><button className="p-2 m-1 btn btn-outline-dark">google</button></Link>

    </div>
  )
}

export default Start