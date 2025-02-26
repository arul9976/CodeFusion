import React, { useContext } from 'react'
import { UserContext } from '../LogInPage/UserProvider'

const Profile = () => {
  const { user } = useContext(UserContext);
  return <img style={{
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    cursor: 'pointer'
  }} src={user.profilePic} alt="" />
}

export default Profile