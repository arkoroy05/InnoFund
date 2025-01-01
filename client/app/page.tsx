import { UserProfile } from '@clerk/clerk-react'
import { SignInButton, SignOutButton, SignUpButton, UserButton } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className="flex gap-4 items-center">
      <SignInButton>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Sign In
        </button>
      </SignInButton>
      {/** this is how youll render the components, style the button, not sign in button */}
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
