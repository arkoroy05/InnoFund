"use client"
import { useState, useEffect } from 'react'
import React from 'react'
import data from './data'
import FundingCard from '@/components/FundingCard'
import { Search } from 'lucide-react'


const ExplorePage = () => {
    // const [data, setData] = useState([]);
    // useEffect(() => {
    //   const fetchProjects = async () => {
    //     try {
    //       const response = await fetch("/api/feed");
    //       const projects = await response.json();
    //       setData(projects);
    //       console.log(projects);
    //     } catch (error) {
    //       console.log("Error fetching projects:", error);
    //     }
    //   };
  
    //   fetchProjects();
    // }, []);
  
  return (
    <>
    <div className="relative top-[3.5rem]">
        <h1 className='text-4xl font-bold my-6 mx-20 flex'>Explore <Search className='h-[calc(2.0rem)] w-[calc(2.0rem)] mx-2' /></h1>
        <div className='outer-grid grid grid-cols-3 mx-20'>
            {data.map((item: any) => (
                <FundingCard key={item.id}
                    title={item.name}
                    field={item.field}
                    desc={item.desc || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
                    timeposted={new Date(item.timePosted)}
                    author={item.author}
                    currentFunding={item.currentFunding}
                    primaryLink={item.primaryLink || "/explore"}
                    goalFunding={item.goalFunding}
                    userAnonimity={item.userAnonimity}
                />
            ))}
        </div>
    </div>
    </>
  )
}

export default ExplorePage