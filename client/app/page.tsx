"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { getAuth, signInWithPopup, GithubAuthProvider} from 'firebase/auth';
import { useRouter } from 'next/navigation'
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const Scene = dynamic(() => import("@/components/Canvas"), { ssr: false });
const ThreeEnabled = true;



const Landing = () => {
  
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    };


    const firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore(firebaseApp);
    const router = useRouter();
  const handleGithubSignIn = async () => {
      const provider = new GithubAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
  
        // Store user data in Firestore
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          githubToken: token,
          projects:{},
          createdAt: new Date(),
          lastLogin: new Date()
        }, { merge: true });
  
        router.push('/explore');
      } catch (error) {
        console.error("Error signing in with GitHub:", error);
      }
    };
   
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {ThreeEnabled && (
        <div className="absolute inset-0">
          <Scene />
        </div>
      )}
      <div className="absolute inset-0 pb-2 flex flex-col items-center justify-center bg-black/80">
        <h1 className="text-4xl p-2 font-sans font-bold bg-clip-text text-transparent bg-gradient-to-t from-neutral-500 to-white">
          Empowering Research, Decentralizing Funding
        </h1>
        <p className="text-neutral-300 text-xl mt-2">Your Innovations Deserve a Platform</p>
        <Button 
        onClick={handleGithubSignIn}
        className="backdrop-blur-lg bg-white/10 rounded-full p-5 py-6 mt-4 text-neutral-300 text-lg hover:bg-white/10 hover:border hover:border-neutral-300/40">
          Get Started <ChevronRight className="" />
        </Button>
      </div>
    </div>
  );
};

export default Landing;
