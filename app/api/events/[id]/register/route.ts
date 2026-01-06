import { prismaNonPooled } from "@/lib/prisma";
import { attendeeSchema } from "@/lib/schema";
import { NextResponse } from "next/server";


export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {

        const paramData = await params;
        // console.log('the param data is', paramData);


        const body = await req.json();
        const { name, email } = attendeeSchema.parse(body);
        const eventId = paramData.id;

        // console.log('event is ', eventId);

        // Transaction: Check capacity -> Register
        const result = await prismaNonPooled.$transaction(async (tx) => {
            // console.log('prining transaction client ');
            // console.log(tx);

            const event = await tx.event.findUnique({
                where: { id: eventId },
                include: { _count: { select: { attendees: true } } }
            });

            if (!event) throw new Error("Event not found");

            if (event._count.attendees >= event.capacity) {
                throw new Error("Event is full");
            }

            return tx.attendee.create({
                data: { name, email, eventId }
            });
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.log('error registering attendee');
        console.log(error);

        if (error.message === "Event is full") {
            return NextResponse.json({ error: "Event is full" }, { status: 409 });
        }
        // Handle unique constraint (P2002) for duplicate email
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "You are already registered" }, { status: 400 });
        }
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}