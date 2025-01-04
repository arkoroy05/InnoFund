'use client'

import { useEffect, useState } from 'react'
import { formatDate } from "@/lib/utils"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import ProjectCard from "@/components/Project-Card"
import ConnectWalletButton from "@/components/connect-web3-wallet"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, get, child } from "firebase/database"
import {toast} from "@/components/ui/toast"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProjects, setUserProjects] = useState([])
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isDeletingProject, setIsDeletingProject] = useState(false)
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        // Add these logs
        console.log("Current user:", user)
        const response = await fetch(`/api/profile?uid=${user.uid}`)
        const data = await response.json()
        console.log("API response data:", data)
        setUserProjects(data.projects || [])
        console.log("Projects after setting state:", data.projects)
      }
    })
    
    return () => unsubscribe()
}, [])

const handleProjectDelete = async (projectId: number) => {
  if (!currentUser || isDeletingProject) return;
  
  setIsDeletingProject(true)
  
  try {
    console.log(currentUser.uid, projectId)
    const response = await fetch(`/api/profile?uid=${currentUser.uid}&projectId=${projectId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      setUserProjects(prevProjects => 
        prevProjects.filter(project => project.id !== projectId)
      );
      toast({
        title: "Success",
        description: "Project successfully deleted",
        variant: "default",
      });
    } else {
      throw new Error('Failed to delete project');
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    toast({
      title: "Error",
      description: "Failed to delete project. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsDeletingProject(false);
  }
}


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
                {userProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} onDelete={handleProjectDelete} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
