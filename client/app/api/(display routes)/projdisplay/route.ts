import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get('key');
    
    if (!projectKey) {
        return NextResponse.json({ error: "Project key is required" }, { status: 400 });
    }

    try {
        const projectRef = ref(db, `projects/${projectKey}`);
        const snapshot = await get(projectRef);
        
        if (!snapshot.exists()) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
        
        const projectData = {
            id: projectKey,
            ...snapshot.val()
        };
        
        return NextResponse.json(projectData);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}
