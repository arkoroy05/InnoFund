"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Scene = dynamic(() => import("@/components/Canvas"), { ssr: false });
const ThreeEnabled = true;
const Landing = () => {
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
        <p className="text-neutral-300 text-xl mt-2">Get funded for your innovations in AVAX</p>
        <Button className="backdrop-blur-lg bg-white/10 rounded-full p-5 py-6 mt-4 text-neutral-300 text-lg hover:bg-white/10 hover:border hover:border-neutral-300/40">
          Get Started <ChevronRight className="" />
        </Button>
      </div>
    </div>
  );
};

export default Landing;
