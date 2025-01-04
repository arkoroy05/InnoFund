import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, runTransaction } from "firebase/database";


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


export async function POST(request: NextRequest) {
    try {
        const body = await request.json(); // Try parsing the JSON body

        // Immediately check if the necessary properties exist and are of the correct type
        if (!body || typeof body.projectId !== 'string' || typeof body.amount !== 'number') {
            return NextResponse.json({ error: "Invalid request body.  'projectId' (string) and 'amount' (number) are required." }, { status: 400 });
        }

        const { projectId, amount } = body;

        const projectRef = ref(db, `projects/${projectId}`);

        await runTransaction(db, async (transaction) => {
            const projectSnapshot = await transaction.get(projectRef);

            if (!projectSnapshot.exists()) {
                throw new Error("Project not found");
            }

            const projectData = projectSnapshot.val();

            if (projectData.donations + amount > projectData.goalAmount) {
                throw new Error("Donation amount exceeds project goal");
            }

            transaction.update(projectRef, { donations: projectData.donations + amount });
        });

        return NextResponse.json({ message: "Donation successful" }, { status: 200 });

    } catch (error) {
        if (error.message === "Project not found") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        } else if (error.message === "Donation amount exceeds project goal") {
            return NextResponse.json({ error: error.message }, { status: 400 });
        } else if (error instanceof SyntaxError && error.message.includes("JSON")) { // Check for JSON parsing errors
            return NextResponse.json({ error: "Invalid JSON data in request body" }, { status: 400 });
        }
        console.error("Error processing donation:", error); // Log the error for debugging
        return NextResponse.json({ error: "Failed to process donation" }, { status: 500 });
    }
}
