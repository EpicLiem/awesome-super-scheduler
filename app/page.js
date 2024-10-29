import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Calendar, Dumbbell } from "lucide-react"
import Link from "next/link";

export default function Homepage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white">
            <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Dumbbell className="h-8 w-8 text-orange-600" />
                    <h1 className="text-2xl font-bold text-orange-600">GFS Fitness Scheduler</h1>
                </div>
                <Link href={'/signin'}>
                    <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-100">Sign In</Button>
                </Link>
            </header>
            <main className="container mx-auto px-4 py-12">
                <section className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-orange-800">Book Your Spot in the Weight Room</h2>
                    <p className="text-xl text-orange-700 mb-8">
                        Easily schedule your workouts and never miss an opening at the Germantown Friends School fitness club
                    </p>
                    <Button size="lg" className="text-lg px-8 bg-orange-600 hover:bg-orange-700 text-white" href={'/signin'}>
                        Start Booking
                    </Button>
                </section>
                <section className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Calendar className="h-12 w-12 text-orange-500" />}
                        title="Easy Booking"
                        description="Reserve your spot in the weight room with just a few clicks"
                    />
                    <FeatureCard
                        icon={<Bell className="h-12 w-12 text-orange-500" />}
                        title="Instant Notifications"
                        description="Get alerted when new spots open up, so you never miss a chance to work out"
                    />
                    <FeatureCard
                        icon={<Dumbbell className="h-12 w-12 text-orange-500" />}
                        title="Fitness Tracking"
                        description="Log your workouts and track your progress over time"
                    />
                </section>
            </main>
            <footer className="container mx-auto px-4 py-6 text-center text-orange-600">
                © {new Date().getFullYear()} Awesome and Super Studios (ASS)
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description }) {
    return (
        <Card className="border-orange-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-4 text-orange-700">
                    {icon}
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-orange-600">{description}</CardDescription>
            </CardContent>
        </Card>
    )
}