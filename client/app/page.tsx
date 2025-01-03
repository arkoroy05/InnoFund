"use client"

import { getAuth, signInWithPopup, GithubAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation'
import React,{useState} from 'react'
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
  
    const handleEmailSignIn = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
  
        // Store user data in Firestore
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          createdAt: new Date(),
          lastLogin: new Date()
        }, { merge: true });
  
        router.push('/feed');
      } catch (error) {
        console.error("Error signing in with email:", error);
      }
    };
  
    const handleEmailSignUp = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
  
        // Store user data in Firestore
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          projects: {},
          createdAt: new Date(),
          lastLogin: new Date()
        });
  
        router.push('/feed');
      } catch (error) {
        console.error("Error signing up with email:", error);
      }

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

      router.push('/feed');
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
    }
  };
 
  return (
    <div className="flex flex-col gap-6 items-center p-8">
      <form className="w-full max-w-md space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <div className="flex gap-4">
          <button
            onClick={handleEmailSignIn}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={handleEmailSignUp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Sign Up
          </button>
        </div>
      </form>

      <div className="flex items-center w-full max-w-md">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Existing GitHub button remains the same */}
      <button 
        onClick={handleGithubSignIn}
        className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
        Sign in with GitHub
      </button>
    </div>
  );
};
}

export default page;