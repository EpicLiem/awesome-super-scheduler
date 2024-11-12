"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Dumbbell, Home, Settings, User, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {Suspense, useEffect} from "react";

// Sample data for available slots (TESTING ONLY)
const availableSlotsReal = [
    { date: new Date(2024, 9, 28), slots: [
            { time: "09:00 AM", duration: "1 hour" },
            { time: "11:00 AM", duration: "1 hour" },
            { time: "02:00 PM", duration: "1 hour" },
        ]},
    { date: new Date(2024, 9, 29), slots: [
            { time: "10:00 AM", duration: "1 hour" },
            { time: "01:00 PM", duration: "1 hour" },
        ]},
    { date: new Date(2024, 9, 30), slots: [
            { time: "08:00 AM", duration: "1 hour" },
            { time: "03:00 PM", duration: "1 hour" },
            { time: "05:00 PM", duration: "1 hour" },
        ]},
]

async function GetAvailableSlots(userData)  {
    if (!userData) return []
    const AvailableSlots = userData.availableSlots.map((x) => {
        const [year, month, day] = x.date.split("-").map(Number);
        return {
            date: new Date(year, month - 1, day), // Month is 0-indexed
            slots: x.slots.map((y) => ({
                time: y,
                duration: "1 hour",
            }))
        };
    });
    console.log(AvailableSlots)
    console.log(AvailableSlots[0].date.toDateString())
    return AvailableSlots
}

async function fetchData() {
    const res = await fetch('/api/dashboard', {'credentials': 'include'})
    return await res.json()
}

export default function Dashboard() {
    const [date, setDate] = React.useState(new Date())
    const [selectedSlot, setSelectedSlot] = React.useState(null)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [availableSlots, setAvailableSlots] = React.useState(availableSlotsReal)
    const [userData, setUserData] = React.useState(false)
    const [numAvailableSlotsNow, setNumAvailableSlotsNow] = React.useState(0)
    const [totalScheduledSlots, setTotalScheduledSlots] = React.useState(0)




    useEffect(() => {
        fetchData().then(setUserData)
        console.log(userData)
    }, [])

    useEffect(() => {
        GetAvailableSlots(userData).then(setAvailableSlots)
    }, [userData])

    useEffect(() => {
        const x = availableSlots.find(
            (day) => day.date.toDateString() === new Date().toDateString()
        )?.slots.length
        if (!x) {
            setNumAvailableSlotsNow(0)
        } else {
            setNumAvailableSlotsNow(x)
        }
    }, [availableSlots])

    useEffect(() => {
        console.log(userData)
        if (!userData) {
            console.log(userData)
            return;
        }
        let x = 0
        for (let i = 0; i < userData.scheduled; i++) {
            console.log(userData.scheduled)
            x += userData.scheduled[i].slots.length
        }
        setTotalScheduledSlots(0)
        setTotalScheduledSlots(x)

    }, [availableSlots])

    const slotsForSelectedDay = availableSlots.find(
        (day) => day.date.toDateString() === date?.toDateString()
    )?.slots || []

    const handleSlotClick = (slot) => {
        setSelectedSlot(slot)
        setIsDialogOpen(true)
    }

    const handleConfirm = () => {
        if(!date) {
            setIsDialogOpen(false)
            setSelectedSlot(null)
            return
        }
        const res = fetch('/api/schedule/create', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({date: date.toDateString(), time: selectedSlot.time})
        })
        console.log(res)
        console.log(`Booking confirmed for ${selectedSlot?.time} on ${date?.toDateString()}`)
        setIsDialogOpen(false)
        setSelectedSlot(null)
    }

    return (
        <Suspense>
        <SidebarProvider>
            <div className="flex h-screen bg-gradient-to-br from-orange-400 via-orange-200 to-blue-300">
                <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center gap-2 px-4 py-2">
                            <Dumbbell className="h-6 w-6 text-blue-600" />
                            <span className="text-lg font-bold text-blue-600">GFS Fitness</span>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Home className="h-4 w-4 mr-2" />
                                    Dashboard
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    Schedule
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <User className="h-4 w-4 mr-2" />
                                    Profile
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <footer className="container mx-auto px-4 py-6 text-center text-orange-600">
                            © {new Date().getFullYear()} Awesome and Super Studios (ASS)
                        </footer>
                    </SidebarFooter>
                    <SidebarRail/>
                </Sidebar>
                <SidebarInset className="flex-1 overflow-auto">
                    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <SidebarTrigger />
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                    </header>
                    <main className="flex-1 p-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Welcome to GFS Fitness Scheduler</CardTitle>
                                    <CardDescription>Book your workout sessions and manage your fitness schedule</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md border shadow"
                                    />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Available Slots</CardTitle>
                                    <CardDescription>
                                        {date ? `Slots for ${date.toDateString()}` : "Select a date to view available slots"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {slotsForSelectedDay.length > 0 ? (
                                        <ul className="space-y-3">
                                            {slotsForSelectedDay.map((slot, index) => (
                                                <button
                                                    key={index}
                                                    className="flex justify-between items-center w-full bg-orange-100 p-2 rounded transition-all duration-300 hover:bg-orange-200 hover:shadow-md transform hover:-translate-y-1"
                                                    onClick={() => handleSlotClick(slot)}
                                                >
                                                    <span className="font-medium">{slot.time}</span>
                                                    <span className="text-sm text-gray-600">{slot.duration}</span>
                                                </button>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No slots available for the selected date.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Workouts Scheduled</CardTitle>
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalScheduledSlots}</div>
                                    <p className="text-xs text-muted-foreground">Idk insert motivation here</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
                                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{numAvailableSlotsNow}</div>
                                    <p className="text-xs text-muted-foreground">For today</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Upcoming Session</CardTitle>
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">2:00 PM</div>
                                    <p className="text-xs text-muted-foreground">Weight Room - 1 hour</p>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </SidebarInset>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Booking</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to book this slot?
                        </DialogDescription>
                    </DialogHeader>
                    {selectedSlot && (
                        <div>
                            <p><strong>Date:</strong> {date?.toDateString()}</p>
                            <p><strong>Time:</strong> {selectedSlot.time}</p>
                            <p><strong>Duration:</strong> {selectedSlot.duration}</p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm}>
                            Confirm Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SidebarProvider>
        </Suspense>
    )
}