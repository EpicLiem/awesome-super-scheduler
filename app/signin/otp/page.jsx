"use client"

import { useState, useRef, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dumbbell } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function OTPInput() {
    const searchParams = useSearchParams()
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

        inputRefs.current[index + 1]?.select()
        if (value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e, index) => {
         if (e.key === "ArrowLeft" && index > 0) {
             inputRefs.current[index - 1]?.select()
            inputRefs.current[index - 1]?.focus()
        } else if (e.key === "ArrowRight" && index < 5) {
             inputRefs.current[index + 1]?.select()
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleFocus = (index) => {
        if (inputRefs.current[index]?.value) {
            inputRefs.current[index].select()
        }
        inputRefs.current[index].select()
    }

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData("Text").slice(0, 6)
        if (/^\d{6}$/.test(pasteData)) {
            console.log(pasteData)
            setOtp(pasteData)
            console.log(otp)
            pasteData.split("").forEach((char, index) => {
                inputRefs.current[index].value = char
            })
            inputRefs.current[5]?.focus()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch("/api/auth/session/authorize", {
            credentials: "same-origin",
            body: JSON.stringify({ email: searchParams.get('email'), digits: otp }),
            method: "POST",
        }).then((res) => {
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
        <Suspense>
            <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-200 to-blue-300 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white bg-opacity-90">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Dumbbell className="h-8 w-8 text-blue-600" />
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
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste}
                                        onFocus={() => handleFocus(index)}
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
        </Suspense>
    )
}