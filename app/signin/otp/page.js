"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dumbbell } from "lucide-react"
import {useSearchParams} from "next/navigation";
import { useRouter } from "next/navigation";

export default function OTPInput() {
    const [otp, setOtp] = useState("")
    const inputRefs = useRef([])
    const [failed, setFailed] = useState(false)
    const [failure, setFailure] = useState('')
    const router = useRouter()

    const handleChange = (e, index) => {
        const value = e.target.value
        if (isNaN(Number(value))) return

        const newOtp = otp.split('')
        newOtp[index] = value
        setOtp(newOtp.join(''))

        // Move to next input if current field is filled
        if (value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = (e) => {
        const searchParams = useSearchParams()
        e.preventDefault()
        const res = fetch("/api/auth/session/authorize", {
                credentials: "same-origin",
                body: JSON.stringify({email: searchParams.get('email'), digits: otp,}),
                method: "POST",
            }
        ).then((res) => {
            if (res.status === 200) {
                res.text().then((text) => {
                    if (text === "Authorized") {
                        setFailed(false)
                        router.push("/dashboard")
                    } else {
                        setFailure('Wrong code, please try again.')
                        setFailed(true)
                    }
                })
            }
        })

        console.log("Submitted OTP:", otp)
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-200 to-blue-300 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white bg-opacity-90">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Dumbbell className="h-8 w-8 text-blue-600"/>
                        <CardTitle className="text-2xl font-bold text-blue-600">GFS Fitness Scheduler</CardTitle>
                    </div>
                    <CardDescription className="text-center">
                        Enter the 6-digit code sent to your email
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="flex justify-between max-w-xs mx-auto">
                            {[...Array(6)].map((_, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={otp[index] || ""}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    className="w-12 h-12 text-center text-2xl"
                                />
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                            disabled={otp.length !== 6}
                        >
                            Verify
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}