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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Clipboard,
  Check,
} from "lucide-react";
import Image from "next/image";

interface ResearchFundingCardProps {
  title: string;
  desc: string;
  field: string;
  timeline: string;
  potentialImpact: string;
  teamSize: number;
  author?: {
    name: string;
    credentials: string;
  };
  currentFunding: number;
  goalFunding: number;
  backers: number;
  daysLeft: number;
}
export default function FundingCard({
  title,
  desc,
  field,
  timeline,
  potentialImpact,
  teamSize,
  author,
  currentFunding,
  goalFunding,
  backers,
  daysLeft,
}: ResearchFundingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const progress = (currentFunding / goalFunding) * 100;
  const fundedPercentage = Math.round(progress);
  return (
    <>
      <Card
        className="w-full rounded-[0] border-neutral-700/20 hover:bg-neutral-900 flex justify-between flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="">
          <div className="flex items-center space-x-4 mb-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
            <div className="flex flex-col w-[calc(100%-4rem)]">
              <span className="text-neutral-700">{author?.name}</span>
              <span className="text-neutral-500 truncate items-center w-[calc(100%-4rem)] text-sm">
                {author?.credentials}

              </span>
              <span className="text-neutral-500 text-sm">
                <Button
                    variant="ghost"
                    className="h-4 hover:bg-transparent p-0 my-1"
                    onClick={() => {
                      navigator.clipboard.writeText(author?.credentials!);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 5000);
                    }}
                    disabled={isCopied}
                  >
                    {isCopied ? (
                      <><Check className="size-4 text-green-500 " />Copied!</>
                    ) : (
                      <><Clipboard className="size-4" />Copy Wallet ID</>
                    )}
                  </Button>
              </span>
            </div>
            <div className="text-neutral-500 text-sm"></div>
          </div>
          <CardTitle className="text-3xl truncate">{title}</CardTitle>
          <CardDescription className="font-medium truncate text-xl text-neutral-700">
            {field}
          </CardDescription>
          <CardDescription className="line-clamp-2">{desc}</CardDescription>
        </CardHeader>

        <CardContent className="flex-col flex">
          <div className="flex items-center space-x-4 w-full"></div>
        </CardContent>

        <CardFooter className="flex items-center flex-col justify-between">
          <span className="text-neutral-700">{timeline}</span>
          <div className="w-full">
            <Progress value={progress} className="m-2"></Progress>
            <div className="flex justify-between w-full">
              <span className="text-neutral-700">
                {currentFunding.toLocaleString()} AVAX
              </span>
              <span className="text-lime-700">
                {goalFunding.toLocaleString()} AVAX
              </span>
            </div>
          </div>
          <Button variant={"outline"} className="w-full my-2 py-5">
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
    </>
  );
}
