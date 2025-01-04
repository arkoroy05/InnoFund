import { User } from "lucide-react";
import { userAgent } from "next/server";

const data = [
  {
    id: 1,
    name: "Nexthire",
    field: "Web Development",
    desc: "Nexthire is a web3 based DeFi application for research papers. It's a platform that allows researchers to raise funds for their research projects in a decentralized manner.",
    timePosted: "2021-07-21T15:45:30Z",
    completionTime: "2025-07-21T15:45:30Z",
    potentialImpact: "Potential Impact 1",
    teamSize: 1,
    author: {
      name: "Arko Roy",
      username: "arkoroy05",
      photoURL: "https://avatars.githubusercontent.com/arkoroy05?size=200",
    },
    currentFunding: 1,
    goalFunding: 1,
    userAnonimity: true,
  },
  {
    id: 2,
    name: "DeFi for Research",

    field: "DeFi",
    desc: "DeFi for Research is a web3 based DeFi application for research papers. It's a platform that allows researchers to raise funds for their research projects in a decentralized manner.",
    timePosted: "2024-07-21T15:45:30Z",
    potentialImpact: "Potential Impact 2",
    teamSize: 1,
    author: {
      name: "Mohikshit Ghorai",
      credentials: "0xAbCdEf0123456789",
      username: "psycocodes",
      photoURL: "https://avatars.githubusercontent.com/psycocodes?size=200",
    },
    currentFunding: 2,
    goalFunding: 2,
    backers: 2,
    daysLeft: 2,
  },
  {
    id: 3,
    name: "Nexthire Research",

    field: "Research",
    desc: "Nexthire Research is a web3 based DeFi application for research papers. It's a platform that allows researchers to raise funds for their research projects in a decentralized manner.",
    timePosted: "2024-02-21T15:45:30Z",
    potentialImpact: "Potential Impact 3",
    teamSize: 1,
    author: {
      name: "Suparno Saha",
      credentials: "0xAbCdEf0123456789",
      username: "letsbecool9792",
    },
    currentFunding: 3,
    goalFunding: 3,
    backers: 3,
    daysLeft: 3,
  },
  {
    id: 4,
    name: "DeFi for Developers",
    field: "DeFi",
    desc: "DeFi for Developers is a web3 based DeFi application for research papers. It's a platform that allows developers to raise funds for their research projects in a decentralized manner.",
    timePosted: "2022-07-21T15:45:30Z",
    potentialImpact: "Potential Impact 4",
    teamSize: 1,
    author: {
      name: "Mohikshit Ghorai",
      credentials: "0xAbCdEf0123456789",
      username: "agnij-dutta",
    },
    currentFunding: 4,
    goalFunding: 4,
    backers: 4,
    daysLeft: 4,
  },
];

export default data;
