"use client";
import React, { useState, useEffect } from "react";
import ResearchFundingCard from "@/components/Card";
import Link from "next/link";
import FundingCard from "@/components/FundingCard";

const page = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/feed");
        const projects = await response.json();
        setData(projects);
        console.log(projects);
      } catch (error) {
        console.log("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold"></h1>
        </div>

        {/* the card component will go here*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-min">
          {data.map((item: any) => (
            <Link href={`/projectdetails/${item.id}`} key={item.id}>
              <ResearchFundingCard
                title={item.name}
                field={item.field}
                timeline={item.timeline}
                potentialImpact={item.potentialImpact}
                teamSize={item.teamSize}
                author={item.author}
                currentFunding={item.currentFunding}
                goalFunding={item.goalFunding}
                backers={item.backers}
                daysLeft={item.daysLeft}
              />
            </Link>
          ))}
          {data.map((item: any) => (
            <Link href={`/projectdetails/${item.id}`} key={item.id}>
              <FundingCard
                title={item.name}
                field={item.field}
                timeline={item.timeline}
                potentialImpact={item.potentialImpact}
                teamSize={item.teamSize}
                author={item.author}
                currentFunding={item.currentFunding}
                goalFunding={item.goalFunding}
                backers={item.backers}
                daysLeft={item.daysLeft}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
