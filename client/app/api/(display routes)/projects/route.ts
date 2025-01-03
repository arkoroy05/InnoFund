import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };


  const firebaseApp = initializeApp(firebaseConfig);
  const db=getFirestore(firebaseApp)


  export async function POST(request:NextRequest){
    if (!request.body) {
        return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Validate the body has required fields
    if (!body.name || !body.about) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    try {
        const docRef = await addDoc(collection(db,"projects"), {
            name: body.name,
            about: body.about,
            teamMembers: body.teamMembers || [],
            timeline: body.timeline || "",
            links: body.links || [],
            citations: body.citations || [],
            goalAmount: body.goalAmount || 0,
            pdfs: body.pdfs || []
        });
        
        return NextResponse.json({
            id: docRef.id,
            ...body
        });
    } catch(error) {
        return NextResponse.json({ error: "Error adding document" }, { status: 500 });
    }
}
