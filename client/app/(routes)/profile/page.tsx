'use client'

import { useEffect, useState } from 'react'
import { formatDate } from "@/lib/utils"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import ProjectCard from "@/components/Project-Card"
import ConnectWalletButton from "@/components/connect-web3-wallet"
import { initializeApp } from "firebase/app"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
        console.log(user)
      }
    })
    
    return () => unsubscribe()
  },[currentUser])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h1 className="text-3xl font-bold text-gray-800">{currentUser?.displayName}</h1>
                <p className="text-sm text-gray-500">u/{currentUser?.email}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  {currentUser?.createdAt && formatDate(new Date(currentUser?.createdAt))}
                </p>
              </div>
              <ConnectWalletButton 
                isConnected={isWalletConnected}
                onConnect={() => setIsWalletConnected(true)}
                onDisconnect={() => setIsWalletConnected(false)}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">Projects</h2>
              <div className="space-y-6">
                {currentUser?.projects?.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
