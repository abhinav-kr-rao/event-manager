"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/EventCard";
import { CreateEventForm } from "@/components/CreateEventForm";

export default function Home() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => (await axios.get("/api/events")).data,
  });

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Event Manager</h1>
        <CreateEventForm />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[200px] w-full rounded-xl" />)}
        </div>
      ) : events?.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No events found. Create one!</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: any) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}