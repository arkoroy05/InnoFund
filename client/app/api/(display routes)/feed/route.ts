import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
    try {
        // Get projects from Realtime Database
        const projectsRef = ref(db, 'projects');
        const projectsSnapshot = await get(projectsRef);
        
        // Get users from Firestore
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        
        const users = usersSnapshot.docs.map(doc => {
            const userData = doc.data();
            const userProjects = projectsSnapshot.exists() 
                ? Object.entries(projectsSnapshot.val())
                    .filter(([_, projectData]: [string, any]) => projectData.userId === doc.id)
                    .map(([projectId, projectData]) => ({
                        id: projectId,
                        ...projectData
                    }))
                : [];

            return {
                id: doc.id,
                ...userData,
                projects: userProjects
            };
        });

        let allProjects: any[] = [];

        users.forEach(user => {
            user.projects.forEach(project => {
                allProjects.push({
                    ...project,
                    goalAmount: project.goalAmount || 0,
                    author: {
                        username: user.githubUsername || null,
                        name: user.displayName || null,
                        photoURL: user.photoURL || null,
                    },
                });
            });
        });

        return NextResponse.json(allProjects);
        
    } catch (error) {
        return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
    }
}
