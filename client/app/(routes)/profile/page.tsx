"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProjectCard from "@/components/Project-Card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import { Toast } from "@/components/ui/toast";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import AnimatedGradientText from "@/components/ui/gradient-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const auth = getAuth();
  const earnings = 20;
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Firebase Auth User:', user);
        setCurrentUser(user);

        // First, check user's projects in Firebase directly
        const userProjectsRef = ref(db, `users/${user.uid}/projects`);
        const userProjectsSnapshot = await get(userProjectsRef);
        console.log('Firebase User Projects Snapshot:', userProjectsSnapshot.val());

        // Then make the API call
        try {
          const response = await fetch(`/api/profile?uid=${user.uid}`);
          console.log('API Response Status:', response.status);
          const data = await response.json();
          console.log('API Response Data:', data);
          
          if (data.projects) {
            setUserProjects(data.projects);
            console.log('Set User Projects:', data.projects);
          } else {
            console.log('No projects found in API response');
            setUserProjects([]);
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch your projects. Please try again.',
            variant: 'destructive',
          });
        }
      } else {
        console.log('No user logged in');
        setCurrentUser(null);
        setUserProjects([]);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleProjectDelete = async (projectId: number) => {
    if (!currentUser || isDeletingProject) return;

    setIsDeletingProject(true);

    try {
      console.log(currentUser.uid, projectId);
      const response = await fetch(
        `/api/profile?uid=${currentUser.uid}&projectId=${projectId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUserProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
        Toast({
          title: "Success",
          description: "Project successfully deleted",
          variant: "default",
        });
      } else {
        throw new Error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      Toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingProject(false);
    }
  };

  return (
    <div className="relative top-[3.5rem]">
      <div className="outsideContainer flex flex-col items-center justify-center mx-[5vw] py-8 gap-3">
        <div className="profile w-full flex space-x-9 justify-between items-center">
          <div className="profile-details w-full p-10 py-0 flex space-x-9 h-full">
            <Avatar className="h-[calc(80%)] aspect-square w-auto border-2 border-stone-700 max-h-[20vh] mt-1">
              <AvatarImage
                src={
                  currentUser?.photoURL ||
                  `https://avatars.githubusercontent.com/${currentUser?.username}?size=200`
                }
                alt={`GitHub avatar for ${currentUser?.username}`}
              />
              <AvatarFallback>
                <AvatarImage src="/avalanche-avax-logo.svg" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-white">
                {currentUser?.displayName}
              </h1>
              <p className="text-lg font-light text-gray-500">
                u/{currentUser?.reloadUserInfo.screenName}
              </p>
              <p className="text-lg font-light text-gray-500 ">
                {currentUser?.email}
              </p>
            </div>
          </div>
        </div>
        <div className="projects bg- w-full flex flex-col">
          <header className="p-10 flex gap-2 items-center">
            <h1 className="text-3xl font-bold">Projects</h1>
            <div className="border border-stone-600 px-2 py-1 rounded-lg">{userProjects.length}</div>
            <Button variant={"outline"} className="text-sm bg-transparent" onClick={() => router.push('/createproject')}>
              <Plus className="h-4 w-4" />
                  Create Project
            </Button>　　 　 　 　
          </header>
          <main className="space-y-6 p-10 pt-0 flex flex-col ">
            {userProjects.length > 0 ? (
              userProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleProjectDelete}
                />
              ))
            ) : (
              <div className="m-auto flex items-center justify-center -translate-x-[10%] -translate-y-[20%]">
                <img
                  src="/empty.png"
                  alt=""
                  className="max-h-[20vw] max-w-[20vw] filter grayscale"
                />
                <p className="text-2xl text-gray-500">No Projects</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
