"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useReadMore } from "@/hooks/useReadMore";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Download,
  FileIcon,
} from "lucide-react";
import { Team } from "@/components/Team";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

interface ProjectData {
  name: string;
  about: string;
  teamMembers: string[];
  userId: string;
  timeline: string;
  links: string[];
  citations: string[];
  goalAmount: number;
  pdfs: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { isConnected: isWalletConnected } = useAccount();
  const handleDonate = () => {
    if (isWalletConnected) {
      router.push(`/payment/${params.id}`); // Route to /payment with projectId
    } else {
      router.push("/login");
    }
  };
  const [data, setData] = useState<ProjectData | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/projdisplay?key=${params.id}`)
      .then((res) => setData(res.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [params.id]);

  const { displayText, isExpanded, toggleReadMore, shouldShowReadMore } =
    useReadMore(data?.about || "", 200);

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <div className="relative top-[3.5rem] min-h-[calc(100vh-3.5rem)] flex justify-center">
        <div className="max-w-[85vw] min-w-[80vw] my-5 flex gap-3 flex-col">
          <h1 className="text-5xl font-bold flex items-center gap-2">
            {data.name}
            <span className="text-base font-light">
              <a
                href={data.links[0]}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {data.links[0]}
              </a>
            </span>
          </h1>
          <p className="text-[1rem] text-neutral-500">
            {data.about}
          </p>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={data.user.photoURL} />
              <AvatarFallback>
                <AvatarImage src="/avalanche-avax-logo.svg" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-neutral-400 text-[1.08rem]">{data.user.displayName}</h2>
          </div>
          <div className="flex gap-4">
            <div className="team-members">
              {data.teamMembers && (
                <>
                  <h1 className="text-lg font-medium">Team Members</h1>
                  {data.teamMembers.map((member, index) => (
                    <p key={index} className="text-lime-600">
                      {member}
                    </p>
                  ))}
                </>
              )}
            </div>
            <div className="citations">
              {data.citations && (
                <>
                  <h1 className="text-lg font-medium">Citations</h1>{" "}
                  {/* see this */}
                  {data.citations?.map((citation, index) => (
                    <p key={index} className="text-gray-500">
                      {citation}
                    </p>
                  ))}
                </>
              )}
            </div>
            <div className="other-links border-neutral-800">
              {data.links.length > 1 && (
                <>
                  <h1 className="text-lg font-medium">Other Relevant Links</h1>
                  {data.links.slice(1, data.links.length).map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      {link}
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </a>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="pdfs flex flex-col gap-2">
            {data.pdfs  && (
              <>
                <h1 className="text-lg font-medium"> Relevant PDFs</h1>
                {data.pdfs.map((pdf, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between max-w-[800px] min-w-[200px] bg-neutral-900 rounded-lg p-2 border border-neutral-800"
                  >
                    <div className="flex items-center gap-2">
                      <FileIcon className="h-5 w-5 text-blue-500" />
                      <div className="border border-neutral-800 p-2 py-1 rounded-lg">
                        {pdf.name.length > 20 ? (
                          <>{pdf.name.substring(0, 17)}...</>
                        ) : (
                          <>{pdf.name}</>
                        )}
                      </div>
                    </div>
                    <a href={pdf.name} download className="flex items-center">
                      <Button variant={"outline"} className="text-neutral-400">
                        <Download className="ml-1 h-4 w-4" /> Download
                      </Button>
                    </a>
                  </div>
                ))}
              </>
            )}
          </div>
          <Button
            variant={"outline"}
            className="w-full mt-2 mb-1 py-6 max-w-[800px] min-w-[200px]"
            disabled={!isWalletConnected}
            onClick={handleDonate}
          >
            <Image
              src="/avalanche-avax-logo.svg"
              alt="Avalanche Logo"
              width={15}
              height={15}
            />
            Donate with AVAX
          </Button>
        </div>
      </div>
    </>
    // <div className="min-h-screen bg-black p-8 relative top-[3.5rem]">
    //   <div className="max-w-4xl mx-auto">
    //     <div className="grid grid-cols-3 gap-8">
    //       <div className="col-span-2">
    //         <h1 className="text-4xl font-bold mb-6 text-white">{data.name}</h1>
    //         <Card className="mb-8">
    //           <CardContent className="p-6">
    //             <h2 className="text-xl font-semibold mb-4 text-black">Project Description</h2>
    //             <p className="text-gray-700">
    //               {displayText}
    //               {shouldShowReadMore && (
    //                 <Button
    //                   variant="link"
    //                   onClick={toggleReadMore}
    //                   className="pl-1 text-green-600 hover:text-green-800"
    //                 >
    //                   {isExpanded ? (
    //                     <>Less <ChevronUp className="ml-1 h-4 w-4" /></>
    //                   ) : (
    //                     <>More <ChevronDown className="ml-1 h-4 w-4" /></>
    //                   )}
    //                 </Button>
    //               )}
    //             </p>
    //           </CardContent>
    //         </Card>

    //         <Card className="mb-8">
    //           <CardContent className="p-6">
    //             <h2 className="text-xl font-semibold mb-4 text-green-700">Team Members</h2>
    //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //               {data.teamMembers.map((member, index) => (
    //                 <Team
    //                   key={index}
    //                   name={member}
    //                   role="Team Member"
    //                   avatarUrl="/placeholder.svg?height=100&width=100"
    //                 />
    //               ))}
    //             </div>
    //           </CardContent>
    //         </Card>

    //         {data.citations && (
    //           <Card className="mb-8">
    //             <CardContent className="p-6">
    //               <h2 className="text-xl font-semibold mb-4 text-green-700">Citations</h2>
    //               <div className="text-gray-700">
    //                 {data.citations}
    //               </div>
    //             </CardContent>
    //           </Card>
    //         )}

    //         {data.pdfs && data.pdfs.length > 0 && (
    //           <Card className="mb-8">
    //             <CardContent className="p-6">
    //               <h2 className="text-xl font-semibold mb-4 text-green-700">Attached Documents</h2>
    //               <ul className="space-y-2">
    //                 {data.pdfs.map((pdf, index) => (
    //                   <li key={index} className="text-gray-700">
    //                     {pdf.name} ({(pdf.size / 1024 / 1024).toFixed(2)} MB)
    //                   </li>
    //                 ))}
    //               </ul>
    //             </CardContent>
    //           </Card>
    //         )}
    //       </div>

    //       <div className="col-span-1">
    //         <div className="sticky top-8">
    //           <Button
    //             className="w-full mb-8 py-6 text-lg font-semibold transition-all duration-300 ease-in-out"
    //             style={{
    //               transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    //               boxShadow: isHovered ? '0 10px 25px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
    //             }}
    //             onMouseEnter={() => setIsHovered(true)}
    //             onMouseLeave={() => setIsHovered(false)}
    //           >
    //             Donate {data.goalAmount} AVAX
    //           </Button>

    //           {data.links && data.links.length > 0 && (
    //             <Card>
    //               <CardContent className="p-6">
    //                 <h2 className="text-xl font-semibold mb-4 text-green-700">Relevant Links</h2>
    //                 <ul className="space-y-2">
    //                   {data.links.map((link, index) => (
    //                     <li key={index}>
    //                       <a
    //                         href={link}
    //                         target="_blank"
    //                         rel="noopener noreferrer"
    //                         className="text-blue-600 hover:text-blue-800 flex items-center"
    //                       >
    //                         {link}
    //                         <ArrowUpRight className="ml-1 h-4 w-4" />
    //                       </a>
    //                     </li>
    //                   ))}
    //                 </ul>
    //               </CardContent>
    //             </Card>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Page;
