// loading.jsx
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dumbbell } from "lucide-react"

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-200 to-blue-300 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white bg-opacity-90">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Dumbbell className="h-8 w-8 text-blue-600" />
                        <CardTitle className="text-2xl font-bold text-blue-600">GFS Fitness Scheduler</CardTitle>
                    </div>
                    <CardDescription className="text-center">
                        Loading...
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between max-w-xs mx-auto">
                        {[...Array(6)].map((_, index) => (
                            <Input
                                key={index}
                                type="text"
                                maxLength={1}
                                disabled
                                className="w-12 h-12 text-center text-2xl bg-gray-200 animate-pulse"
                            />
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="w-full h-12 bg-orange-500 animate-pulse rounded"></div>
                </CardFooter>
            </Card>
        </div>
    )
}