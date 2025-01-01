"use client"
import React, { useEffect } from 'react'
import { useAuth, UserButton,useUser } from '@clerk/nextjs'

const page = () => {
  const {user}=useUser()
  return (
    <div>
      WASSUP {user?.firstName}
      <UserButton />{/** this is usericon, it doesnt accept any props/classname */}
    </div>
  )
}

export default page