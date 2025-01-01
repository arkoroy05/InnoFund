"use client"

import { UserProfile } from '@clerk/clerk-react'
import { SignInButton, SignOutButton, SignUpButton, UserButton, useAuth, useUser } from '@clerk/nextjs'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
  const router = useRouter()
  const { isSignedIn, userId } = useAuth()
  const { user } = useUser()
  

  useEffect(() => {
    const createUser = async () => {
      if (user && user.username && user.emailAddresses[0]?.emailAddress  && user.primaryWeb3Wallet?.web3Wallet) {
        const userData = {
          name: user.username,
          email: user.emailAddresses[0].emailAddress,
          wallet: user.primaryWeb3Wallet?.web3Wallet
        }
        
        try {
          await axios.post("/api/users", userData)
        } catch (error) {
          console.log('Error creating user:', error)
        }
      }
    }

    if (user) {
      createUser()
    }

    if (isSignedIn) {
      router.push(`/feed`)
    }
  }, [user, isSignedIn, router])

  return (
    <div className="flex gap-4 items-center">
      <SignInButton>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Sign In
        </button>
      </SignInButton>
      <UserButton />
      <SignUpButton>
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Sign Up
        </button>
      </SignUpButton>
    </div>
  )
}

export default page
