"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { attendeeSchema } from "@/lib/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function RegisterAttendeeForm({ eventId, isFull }: { eventId: string, isFull: boolean }) {
    const [open, setOpen] = useState(false);
    // const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof attendeeSchema>>({
        resolver: zodResolver(attendeeSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: any) => axios.post(`/api/events/${eventId}/register`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            // toast({ title: "Registered!", description: "See you there." });
            setOpen(false);
            form.reset();
        },
        onError: (error: any) => {
            const msg = error.response?.data?.error || "Registration failed";
            console.log(msg);

            // toast({ variant: "destructive", title: "Error", description: msg });
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" disabled={isFull}>
                    {isFull ? "Full" : "Join Event"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Register</DialogTitle></DialogHeader>
                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input {...form.register("name")} />
                        {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input {...form.register("email")} />
                        {form.formState.errors.email && <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? "Joining..." : "Confirm Registration"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}