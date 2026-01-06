import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { RegisterAttendeeForm } from "./RegisterForm";
import { EventWithCount } from "@/lib/schema";

export function EventCard({ event }: { event: EventWithCount }) {
    const isFull = event._count.attendees >= event.capacity;

    return (
        <Card className="flex flex-col justify-between">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{event.title}</CardTitle>
                    {/* {isFull && <Badge variant="destructive">Sold Out</Badge>} */}
                </div>
                <CardDescription>{new Date(event.date).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                <div className="text-sm font-medium">
                    Attendees: {event._count.attendees} / {event.capacity}
                </div>
                {/* Progress bar visual could go here */}
            </CardContent>
            <CardFooter>
                <RegisterAttendeeForm eventId={event.id} isFull={isFull} />
            </CardFooter>
        </Card>
    );
}