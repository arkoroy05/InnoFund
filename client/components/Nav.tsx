"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import CustomConnectButton from "@/components/CustomConnect";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};



const NavBar = () => {
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const router = useRouter();
  const { isConnected } = useAccount();
  const canPost = isConnected;
  const handleGithubSignIn = async () => {
    const provider = new GithubAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
  
      // Store user data in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          githubToken: token,
          projects: {},
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        { merge: true }
      );
  
      router.push("/explore");
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out. Please try again.");
    }
  };

  const unprotectedlinks = [{ name: "Home", href: "/", searchHref: "/" }];
  const protectedlinks = [
    { name: "Explore", href: "/explore", searchHref: "/explore" },
    { name: "Create", href: "/createproject", searchHref: "/createproject" },
    { name: "Profile", href: "/profile", searchHref: "/profile" },
  ];

  const [user, setUser] = useState(null);
  const links = user ? protectedlinks : unprotectedlinks;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Unsubscribe when component unmounts
  }, []);

  const currentPath = usePathname();

  const isActive = (itemLink: string) => {
    return itemLink === "/"
      ? currentPath === itemLink
      : currentPath.startsWith(itemLink) || currentPath === itemLink;
  };

  const handleClick = (href: string) => {
    if (href === "/createproject" && !canPost) {
      toast.error("Please connect your wallet to create a project.");
    } else {
      router.push(href);
    }
  };


  return (
    <div className="fixed left-0 top-0 w-full h-[3.5rem]  backdrop-blur-[20rem] z-[99] flex items-center justify-between p-2 pl-3 border-b border-neutral-800/20">
      <a href="/">
        <h1 className="text-2xl font-extralight font-mono text-violet-400">
          IF
        </h1>
      </a>

      <nav className="flex items-center gap-7">
        {links.map((item) => (
          <a
            key={item.href}
            href="#"
            onClick={() => handleClick(item.href)}
            className={`
              text-l font-light cursor-pointer
              ${
                isActive(item.searchHref)
                  ? "text-primary"
                  : "text-primary/60 hover:text-primary"
              }
            `}
          >
            {item.name}
          </a>
        ))}
        {user ? (
          <>
            <CustomConnectButton />
            <button
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-full font-light"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-full font-light"
            onClick={handleGithubSignIn}
          >
            Get Started
          </button>
        )}
      </nav>
    </div>
  );
};

export default NavBar;

