"use client"
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { onAuthStateChanged } from 'firebase/auth';
import { ConnectButton } from "@rainbow-me/rainbowkit";
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

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);


const NavBar = () => {
  const unprotectedlinks = [
    { name: "Home", href: "/", searchHref: "/" },    
  ];
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

  // Get current path from window location
  const currentPath = usePathname();
  
  const isActive = (itemLink: string) => {
    // Exact match for root, starts with for other paths
    return itemLink === '/' 
      ? currentPath === itemLink 
      : currentPath.startsWith(itemLink) || currentPath === itemLink;
  };

  return (
    <div className="fixed left-0 top-0 w-full h-[3.5rem]  backdrop-blur-[20rem] z-[99] flex items-center justify-between p-2 pl-3 border-b border-neutral-800/20">
      <a href="/">
        <h1 className="text-2xl font-extralight font-mono text-violet-400">IF</h1>
      </a>
      
      <nav className="flex items-center gap-7">
        {links.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`
              text-l font-light
              ${isActive(item.searchHref)
                ? 'text-primary'
                : 'text-primary/60 hover:text-primary'}
            `}
          >
            {item.name}
          </a>
        ))}
        {user ? (
          <>
          <CustomConnectButton />
          </>
        ) : (
          <button className="inline-flex h-auto p-2 px-3 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium pointer-events-auto hover:border-violet-700/70" onClick={() => (window.location.href = "/user")}>
            Get Started
          </button>
        )}
      </nav>
    </div>
    
  );
};

export default NavBar;
