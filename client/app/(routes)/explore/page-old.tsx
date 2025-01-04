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
                    title={item?.name || "No Title Provided"}
                    field={item?.field || "No Field Provided"}
                    desc={item?.desc || "No Description Provided"}
                    timeposted={new Date(item?.timePosted) || null}
                    author={item?.author}
                    currentFunding={item?.currentFunding || 0}
                    primaryLink={item?.primaryLink || "/explore"}
                    goalFunding={item?.goalFunding || 0}
                    userAnonimity={item?.userAnonimity || false}
                    completionTime={new Date(item?.completionTime) || null}
                />
            ))}
        </div>
    </div>
    </>
  )
}

export default ExplorePage