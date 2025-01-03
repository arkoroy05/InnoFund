"use client"
import { usePathname } from "next/navigation";
import React from "react";

const NavBar = () => {
  const links = [
    { name: "Home", href: "/", searchHref: "/" },    
  ];

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
                  <button className="inline-flex h-auto p-2 px-3 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium pointer-events-auto hover:border-violet-700/70" onClick={() => (window.location.href = "/user")}>
        Get Started
      </button>
      </nav>
    </div>
  );
};

export default NavBar;