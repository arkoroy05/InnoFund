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
import { Clipboard, Check } from "lucide-react";
import Image from "next/image";

interface Author {
  username: string;
  name: string;
  photoURL: string;
}

interface ResearchFundingCardProps {
  key: number;
  title: string;
  desc: string;
  field: string;
  timeposted: Date;
  primaryLink: string;
  author?: Author;
  currentFunding: number;
  goalFunding: number;
  userAnonimity: boolean;
}

function formatDistanceToNow(date: Date): string {
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

export default function FundingCard({
  title,
  desc,
  field,
  primaryLink,
  timeposted,
  author,
  currentFunding = 0, // Provide default values
  goalFunding = 0,    // Provide default values
}: ResearchFundingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const progress = goalFunding > 0 ? (currentFunding / goalFunding) * 100 : 0;
  const fundedPercentage = Math.round(progress);

  return (
    <Card
      className="w-full rounded-[0] border-neutral-700/20 hover:bg-neutral-900 flex justify-between flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <div className="flex items-center space-x-4 mb-2">
          <Avatar>
            <AvatarImage
              src={author?.photoURL || `https://avatars.githubusercontent.com/${author?.username}?size=200`}
              alt={`GitHub avatar for ${author?.username || 'Anonymous'}`}
            />
            <AvatarFallback>
              <AvatarImage src="/avalanche-avax-logo.svg" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col w-[calc(100%-4rem)]">
            <span className="text-neutral-700">{author?.name || 'Anonymous'}</span>
            <span className="text-neutral-500 truncate items-center w-[calc(100%-4rem)] text-sm">
              {author?.username || 'anonymous'}
            </span>
            <span className="text-neutral-500 text-sm">
              <Button
                variant="ghost"
                className="h-4 hover:bg-transparent p-0 my-1"
                onClick={() => {
                  if (author?.username) {
                    navigator.clipboard.writeText(author.username);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 5000);
                  }
                }}
                disabled={isCopied || !author?.username}
              >
                {isCopied ? (
                  <><Check className="size-4 text-green-500" />Copied!</>
                ) : (
                  <><Clipboard className="size-4" />Copy UserID</>
                )}
              </Button>
            </span>
          </div>
        </div>
        <a href={primaryLink} className="text-3xl truncate">
          <CardTitle>{title}</CardTitle>
        </a>
        <CardDescription className="font-medium truncate text-xl text-neutral-700">
          {field}
        </CardDescription>
        <CardDescription className="line-clamp-3">{desc}</CardDescription>
      </CardHeader>

      <CardContent className="flex-col flex">
        <div className="flex items-center space-x-4 w-full"></div>
      </CardContent>

      <CardFooter className="flex items-center flex-col justify-between">
        <span className="text-neutral-700">
          {formatDistanceToNow(timeposted)}
        </span>
        <div className="w-full">
          <Progress value={progress} className="m-2" />
          <div className="flex justify-between w-full">
            <span className="text-neutral-700">
              {currentFunding?.toLocaleString() || '0'} AVAX
            </span>
            <span className="text-lime-700">
              {goalFunding?.toLocaleString() || '0'} AVAX
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full my-2 py-5">
          <Image
            src="/avalanche-avax-logo.svg"
            alt="Avalanche Logo"
            width={15}
            height={15}
          />
          Donate with AVAX
        </Button>
      </CardFooter>
    </Card>
  );
}