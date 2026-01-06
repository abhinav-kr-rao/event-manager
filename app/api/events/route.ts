import prisma from "@/lib/prisma";
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

        // console.log('the body is', body);

        // console.log('the validated data is', validatedData);


        // Convert string date to Date object for Prisma
        const event = await prisma.event.create({
            data: {
                ...validatedData,
                description: validatedData.description || '',
                date: new Date(validatedData.date),
            },
        });
        return NextResponse.json(event);
    } catch (error) {
        console.log('error showing events');
        console.log(error);

        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
}