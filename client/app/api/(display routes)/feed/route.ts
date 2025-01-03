import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);


  export async function GET(request: NextRequest) {
    try {
        const projectsRef = collection(db, "projects");
        const querySnapshot = await getDocs(projectsRef);
        
        const projects = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching projects" }, { status: 500 });
    }
}