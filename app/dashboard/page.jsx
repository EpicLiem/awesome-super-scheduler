"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Dumbbell, Home, Settings, User } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

// Sample data for available slots
const availableSlots = [
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

export default function Dashboard() {
    const [date, setDate] = React.useState(new Date())

    const slotsForSelectedDay = availableSlots.find(
        (day) => day.date.toDateString() === date?.toDateString()
    )?.slots || []

    return (
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
                        {/* Add footer content if needed */}
                    </SidebarFooter>
                    <SidebarRail />
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
                                        <ul className="space-y-2">
                                            {slotsForSelectedDay.map((slot, index) => (
                                                <li key={index} className="flex justify-between items-center bg-orange-100 p-2 rounded">
                                                    <span className="font-medium">{slot.time}</span>
                                                    <span className="text-sm text-gray-600">{slot.duration}</span>
                                                </li>
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
                                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">24</div>
                                    <p className="text-xs text-muted-foreground">+10% from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
                                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">7</div>
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
        </SidebarProvider>
    )
}