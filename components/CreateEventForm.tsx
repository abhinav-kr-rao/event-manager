"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast"; // Shadcn toast hook
import { useState } from "react";
import { eventFormSchema } from "@/lib/schema";

export function CreateEventForm() {
    const [open, setOpen] = useState(false);
    // const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: any) => axios.post("/api/events", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            // toast({ title: "Success", description: "Event created successfully!" });
            setOpen(false);
            form.reset();
        },
        onError: () => {
            // toast({ variant: "destructive", title: "Error", description: "Failed to create event." });
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button>Create Event</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>New Event</DialogTitle></DialogHeader>
                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                    <div>
                        <Label>Title</Label>
                        <Input {...form.register("title")} placeholder="Tech Meetup" />
                        {form.formState.errors.title && <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Date</Label>
                            <Input type="datetime-local" {...form.register("date")} />
                            {form.formState.errors.date && <p className="text-red-500 text-sm">{form.formState.errors.date.message}</p>}
                        </div>
                        <div>
                            <Label>Capacity</Label>
                            <Input type="number" {...form.register("capacity")} />
                            {form.formState.errors.capacity && <p className="text-red-500 text-sm">{form.formState.errors.capacity.message}</p>}
                        </div>
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Input {...form.register("description")} />
                        {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
                    </div>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? "Creating..." : "Create Event"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}