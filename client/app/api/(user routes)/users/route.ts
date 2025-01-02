import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";


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


export async function POST(request: NextRequest) {
    const body = await request.json();
    
    try {
        const docRef = await addDoc(collection(db, "users"), {
            name: body.name,
            email: body.email,
            walletAddress: body.wallet
        });
        
        return NextResponse.json({ 
            id: docRef.id,
            name: body.name,
            email: body.email,
            walletAddress: body.wallet
        });
    } catch (error) {
        return NextResponse.json({ error: "Error adding document" }, { status: 500 });
    }
}


