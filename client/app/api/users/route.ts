import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(request: NextRequest) {
    const body = await request.json();
    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
           walletAddress: body.wallet
        }
    });
    return NextResponse.json(user);
}