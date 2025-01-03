"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Clock, Users, TrendingUp, Award } from "lucide-react";

interface ResearchFundingCardProps {
  title: string;
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
  const progress = (currentFunding / goalFunding) * 100;
  const fundedPercentage = Math.round(progress);
  return <>
  <Card
    className="w-full max-w-sm"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <CardHeader className="flex items-center justify-between">
    </CardHeader>
    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    <CardContent className="flex flex-col gap-2">
    </CardContent>
    <CardFooter className="flex items-center justify-between">
    </CardFooter>
  </Card>
  </>
}