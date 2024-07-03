import React from 'react'
import { useNavigate } from 'react-router-dom'

const Error = () => {
  const navigate = useNavigate()
  return (
    <div className='d-flex flex-column justify-content-center align-items-center w-100 text-light'>
      oops! are you lost??
      <button className='btn btn-outline-warning w-25 my-4 mb-5' onClick={() => navigate('/chat')} >Go back to chat</button>
    </div>
  )
}

export default Error