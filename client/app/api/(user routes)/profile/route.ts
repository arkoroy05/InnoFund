import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get,remove } from "firebase/database";
import { da } from "date-fns/locale";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(firebaseApp);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  if (!uid) {
    return NextResponse.json({ error: 'Missing uid parameter' }, { status: 400 });
  }

  try {
    // Get projects for specific user from RTDB
    const projectsRef = ref(db, `users/${uid}/projects`);
    const snapshot = await get(projectsRef);
    
    if (snapshot.exists()) {
      const userProjects = snapshot.val();
      
      // Fetch full project details for each project ID
      const projectPromises = Object.keys(userProjects).map(async (projectId) => {
        const projectRef = ref(db, `projects/${projectId}`);
        const projectSnapshot = await get(projectRef);
        return {
          id: projectId,  // Add this line to include the ID
          ...projectSnapshot.val()
        };
      });
      
      // Wait for all project queries to complete
      const projectDetails = await Promise.all(projectPromises);
      
      return NextResponse.json({ projects: projectDetails }, { status: 200 });
    } else {
      return NextResponse.json({ projects: [] }, { status: 200 });
    }
    
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching projects data' }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  const projectId = searchParams.get('projectId');

  if (!uid || !projectId) {
    return NextResponse.json({ error: 'Missing uid or projectId parameter' }, { status: 400 });
  }

  try {
    // First, verify the project exists and belongs to the user
    const userProjectRef = ref(db, `users/${uid}/projects/${projectId}`);
    const userProjectSnapshot = await get(userProjectRef);

    if (!userProjectSnapshot.exists()) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // Begin deletion process
    const projectRef = ref(db, `projects/${projectId}`);
    
    // Use transaction to ensure atomic updates
    await Promise.all([
      remove(userProjectRef),
      remove(projectRef)
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ 
      error: 'Error deleting project',
      details: error.message 
    }, { status: 500 });
  }
}