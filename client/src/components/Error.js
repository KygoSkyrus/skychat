import React from 'react'
import { useNavigate } from 'react-router-dom'

const Error = () => {
  const navigate = useNavigate()
  return (
    <div className='d-flex flex-column justify-content-center align-items-center'>
      ERROR
      <button className='btn btn-outline-warning w-25 my-3 mb-5' onClick={() => navigate(-1)} >Go back</button>
    </div>
  )
}

export default Error