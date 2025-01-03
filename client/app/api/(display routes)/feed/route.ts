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
    try {
        const projectsRef = ref(db, 'projects');
        const snapshot = await get(projectsRef);
        
        if (snapshot.exists()) {
            const projects = Object.entries(snapshot.val()).map(([id, data]) => ({
                id,
                ...data
            }));
            return NextResponse.json(projects);
        }
        
        return NextResponse.json([]);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching projects" }, { status: 500 });
    }
}
