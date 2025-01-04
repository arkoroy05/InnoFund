import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

export async function POST(request: NextRequest) {
    const body = await request.json();
    
    if (!body.name || !body.about || !body.userId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    try {
        const projectsRef = ref(db, 'projects');
        const newProjectRef = push(projectsRef);
        
        const projectData = {
            name: body.name,
            about: body.about,
            userId:body.userId,
            createdAt: Date.now(),
            teamMembers: body.teamMembers || [],
            timeline: body.timeline || "",
            links: body.links || [],
            citations: body.citations || "",
            designation: body.designation || "",
            goalAmount: body.goalAmount || 0,
            pdfs: body.pdfs || [],
            isAnonymous: body.isAnonymous || false,
        };

        await set(newProjectRef, projectData);
        
        // Also update user's projects
        const userProjectRef = ref(db, `users/${body.userId}/projects/${newProjectRef.key}`);
        await set(userProjectRef, true);
        
        return NextResponse.json({
            id: newProjectRef.key,
            ...projectData
        });
    } catch(error) {
        return NextResponse.json({ error: "Error adding document" }, { status: 500 });
    }
}
