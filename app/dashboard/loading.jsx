import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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

export default function DashboardSkeleton() {
    return (
        <SidebarProvider>
            <div className="flex h-screen bg-gradient-to-br from-orange-400 via-orange-200 to-blue-300">
                <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center gap-2 px-4 py-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            {[...Array(4)].map((_, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton>
                                        <Skeleton className="h-4 w-4 mr-2" />
                                        <Skeleton className="h-4 w-20" />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
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
                        <Skeleton className="h-6 w-32" />
                    </header>
                    <main className="flex-1 p-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-48 mb-2" />
                                    <Skeleton className="h-4 w-64" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-[300px] w-full" />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-32 mb-2" />
                                    <Skeleton className="h-4 w-48" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {[...Array(3)].map((_, index) => (
                                            <Skeleton key={index} className="h-12 w-full" />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {[...Array(3)].map((_, index) => (
                                <Card key={index}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            <Skeleton className="h-4 w-24" />
                                        </CardTitle>
                                        <Skeleton className="h-4 w-4" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-8 w-16 mb-1" />
                                        <Skeleton className="h-4 w-32" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}