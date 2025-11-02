import React from 'react'
import { UserContext } from '../context/user.context.jsx'
import { useContext } from 'react'
const Home = () => {
    const {user}=useContext(UserContext)
  return (
    <div>
      {JSON.stringify(user)}
    </div>
  )
}

export default Home
