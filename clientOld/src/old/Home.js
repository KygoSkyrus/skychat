import { React, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { NewRTCA } from './NewRTCA'

const Home = ({ user }) => {
  // console.log('>>>>>>>',user.displayName)

  const handleLogout = () => {
    sessionStorage.removeItem('Auth Token');
    navigate('/')
  }

  let [n, setn] = useState();
  let [e, sete] = useState();

//have to remove the cookies or session storage on logout

  let navigate = useNavigate();

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token')//to check if the user has registered before

    if (authToken) {
      navigate('/home')
    }
    console.log(user)

    setn(Cookies.get('name'));
    sete(Cookies.get('email'));
    console.log(n, Cookies.get('name'))
    //so if the username in the cookie is not there then it will run logout function
    if (!n) {
      console.log('there')
      // handleLogout();
    }

    if (!authToken) {
      navigate('/')
    }
  }, [n])


  //use the response token or something like that from the girebase login resposne and store that as cookie with expiry date
  //also find out what can be done with that token,, if with that tocken you can retrieve the user's profile etc,,,




  return (
    <div>Home


      {/* <div>
        <h5>Profile Info</h5>
        <div style={{ display: "flex" }}>
          <p className="p-2 m-1 bg-secondary">{n}</p>
          <p className="p-2 m-1 bg-secondary">{e}</p>
          <button className="btn btn-dark" onClick={handleLogout} >LOGOUT</button>
        </div>
      </div> */}

<NewRTCA n={n} handleLogout={handleLogout}/>






    </div>
  )
}

export default Home