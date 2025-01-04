import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
const firestore = getFirestore(firebaseApp);

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
        
        const projectData = snapshot.val();

        // Fetch user data if userId exists in project data
        if (projectData && projectData.userId) {
            const userDocRef = doc(firestore, "users", projectData.userId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                projectData.user = userDocSnap.data();
            } else {
                console.warn("User data not found for userId:", projectData.userId);
                // You might want to handle this case differently, e.g., setting projectData.user to null
            }
        } else {
          console.warn("Project data does not contain a userId.");
        }


        return NextResponse.json({id: projectKey, ...projectData});
    } catch (error) {
        console.error("Error fetching project or user data:", error);
        return NextResponse.json({ error: "Failed to fetch project or user data" }, { status: 500 });
    }
}
