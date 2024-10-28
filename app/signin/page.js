"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dumbbell } from "lucide-react"
import { useRouter } from "next/navigation";

export default function SignIn() {
    const [email, setEmail] = useState("")
    const router = useRouter()

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch("/api/auth/session/create?email=" + email, {credentials: "same-origin"})
        router.push("/signin/otp?email=" + email)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-200 to-blue-300 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white bg-opacity-90">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Dumbbell className="h-8 w-8 text-blue-600" />
                        <CardTitle className="text-2xl font-bold text-blue-600">GFS Fitness Scheduler</CardTitle>
                    </div>
                    <CardDescription className="text-center">
                        Enter your email to sign in to your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="student@germantownfriendschool.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                            Sign In
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}