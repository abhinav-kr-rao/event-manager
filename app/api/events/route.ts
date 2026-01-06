import { prisma } from "@/lib/prisma";
import { eventFormSchema } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
    const events = await prisma.event.findMany({
        orderBy: { date: 'asc' },
        include: {
            _count: { select: { attendees: true } }
        }
    });
    return NextResponse.json(events);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = eventFormSchema.parse(body);

        // Convert string date to Date object for Prisma
        const event = await prisma.event.create({
            data: {
                ...validatedData,
                date: new Date(validatedData.date),
            },
        });
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
}