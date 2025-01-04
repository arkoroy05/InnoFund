// FundingCard.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clipboard, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Author {
  username: string;
  name: string;
  photoURL: string;
}

interface ResearchFundingCardProps {
  key: Number;
  id: string;
  title: string;
  desc: string;
  field: string;
  timeposted: Date;
  completionTime: Date;
  primaryLink: string;
  author: {
    username: string;
    name: string;
    photoURL: string;
  };
  currentFunding: number;
  goalFunding: number;
  userAnonimity: boolean;
}

function formatDistanceToNow(date: Date | null): string {
  if (!date || isNaN(date.getTime())) {
    return "Indefinite";
  }
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));

  if (diffYears > 0) {
    return `${diffYears} years ago`;
  } else {
    const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    if (diffWeeks > 0) {
      return `${diffWeeks} weeks ago`;
    } else {
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        return `${diffDays} days ago`;
      } else {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours > 0) {
          return `${diffHours} hours ago`;
        } else {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          return `${diffMinutes} minutes ago`;
        }
      }
    }
  }
}
export function formatTimeRemaining(endDate: Date | null): string {
  if (!endDate || isNaN(endDate.getTime())) {
    return "Indefinite";
  }
  console.log(endDate);
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();

  // Check if the date has passed
  if (diffMs < 0) {
    return "Ended";
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minutes left`;
    }
    return `${diffHours} hours left`;
  }

  return `${diffDays} days left`;
}

export default function FundingCard({
  id,
  title,
  desc,
  field,
  primaryLink,
  timeposted,
  completionTime,
  author,
  currentFunding,
  goalFunding,
  userAnonimity,
}: ResearchFundingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const progress = (currentFunding / goalFunding) * 100;
  const user = {
    username: userAnonimity ? "anonymous" : author?.username || "Anonymous",
    name: userAnonimity ? "Anonymous" : author?.name || "Anonymous",
    photoURL: userAnonimity
      ? "https://avatars.githubusercontent.com/u/0"
      : author?.photoURL || "https://avatars.githubusercontent.com/u/0",
  };
  const router = useRouter();
  return (
    <>
      <TooltipProvider>
        <Link href={`/projects/${id}`}>
          <Card
            className="w-full rounded-[0] border-neutral-700/20 hover:bg-neutral-900 flex justify-between flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <CardHeader className="">
              <div className="flex items-center space-x-4 mb-2">
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar>
                      <AvatarImage
                        src={
                          user.photoURL ||
                          `https://avatars.githubusercontent.com/${user.username}?size=200`
                        }
                        alt={`GitHub avatar for ${user.username}`}
                      />
                      <AvatarFallback>
                        <AvatarImage src="/avalanche-avax-logo.svg" />
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent className="bg-neutral-900 text-white border border-neutral-700">
                    {"Avatar for " + user.username}
                  </TooltipContent>
                </Tooltip>
                <div className="flex flex-col w-[calc(100%-4rem)]">
                  <span className="text-neutral-700">{user.name}</span>
                  <span className="text-neutral-500 truncate items-center w-[calc(100%-4rem)] text-sm">
                    {user?.username}
                  </span>
                  <span className="text-neutral-500 text-sm">
                    <Button
                      variant="ghost"
                      className="h-4 hover:bg-transparent p-0 my-1"
                      onClick={() => {
                        navigator.clipboard.writeText(user.username!);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 5000);
                      }}
                      disabled={isCopied}
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-4 text-green-500 " />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Clipboard className="size-4" />
                          Copy UserID
                        </>
                      )}
                    </Button>
                  </span>
                </div>
                <div className="text-neutral-500 text-sm"></div>
              </div>
              <Tooltip>
                <a href={primaryLink} className="text-3xl truncate">
                  <TooltipTrigger>
                    <CardTitle>{title}</CardTitle>
                  </TooltipTrigger>
                </a>
                <TooltipContent className="bg-neutral-900 text-white border border-neutral-700">
                  {primaryLink === "/explore"
                    ? `${title}`
                    : `${title}:${primaryLink}`}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <CardDescription className="font-medium truncate text-xl text-neutral-700">
                  <TooltipTrigger>{field}</TooltipTrigger>
                </CardDescription>
                <TooltipContent className="bg-neutral-900 text-white border border-neutral-700">
                  {field}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger className="text-left">
                  <CardDescription className="line-clamp-3 ">{desc}</CardDescription>
                </TooltipTrigger>
                <TooltipContent className="bg-neutral-900 text-white border border-neutral-700 max-w-[300px]">{desc}</TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardFooter className="flex items-center flex-col justify-between">
              <span className="mb-2">
                <span className="text-neutral-400 px-2 py-1 rounded-full bg-neutral-800">
                  {formatDistanceToNow(new Date(timeposted))}
                </span>{" "}
                {"\u2022"}{" "}
                <span className="text-gray-300 border px-2 py-1 rounded-full bg-neutral-800">
                  {formatTimeRemaining(completionTime)}
                </span>
              </span>
              <div className="w-full">
                <Progress value={progress} className="m-2"></Progress>
                <div className="flex justify-between w-full">
                  <span className="text-neutral-600">
                    {currentFunding.toLocaleString()} AVAX
                  </span>
                  <span className="text-lime-500">
                    {goalFunding.toLocaleString()} AVAX
                  </span>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <Button variant={"outline"} className="w-full mt-2 mb-1 py-6">
                    <Image
                      src="/avalanche-avax-logo.svg"
                      alt="Avalanche Logo"
                      width={15}
                      height={15}
                    />
                    Donate with AVAX
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Donate with AVAX</TooltipContent>
              </Tooltip>
            </CardFooter>
          </Card>
        </Link>
      </TooltipProvider>
    </>
  );
}