import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export async function GET(request) {
    const cookie = await cookies()
    const emailcookie = cookie.get('email')
    const tokencookie = cookie.get('token')
    if (!emailcookie || !tokencookie) {
        return new Response('Invalid token', {
            status: 401,
        });
    }
    const email = emailcookie.value;
    const token = tokencookie.value;
    if (email && token) {
        if (!await bcrypt.compare('Authorized' + email, token)) {
            return new Response('Unauthorized', {
                status: 401,
            })
        }
    } else {
        return new Response('Unauthorized', {
            status: 401,
        })
    }
    try {
        // Query to get user details
        const userResult = await sql`
            SELECT user_id, name FROM Users WHERE email = ${email};
        `;

        if (userResult.rows.length === 0) {
            return new Response('User not found', {status: 404})
        }

        const user = userResult.rows[0];

        // Query to get all workouts with available slots
        const availableSlotsResult = await sql`
            SELECT W.workout_datetime, WS.available_slots
            FROM Workouts W
            JOIN Workout_Slots WS ON W.workout_id = WS.workout_id
            WHERE WS.available_slots > 0;
        `;

        // Group available slots by date
        const availableSlots = availableSlotsResult.rows.reduce((acc, { workout_datetime, available_slots }) => {
            const dateKey = workout_datetime.toISOString().split('T')[0];
            const time = new Date(workout_datetime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            const dateEntry = acc.find(entry => entry.date === dateKey);
            if (dateEntry) {
                dateEntry.slots.push(time);
            } else {
                acc.push({ date: dateKey, slots: [time] });
            }
            return acc;
        }, []);

        // Query to get the user's scheduled workouts
        const scheduledWorkoutsResult = await sql`
            SELECT W.workout_datetime
            FROM User_Workouts UW
            JOIN Workouts W ON UW.workout_id = W.workout_id
            WHERE UW.user_id = ${user.user_id} AND UW.status = 'scheduled';
        `;

        // Group scheduled workouts by date
        const scheduled = scheduledWorkoutsResult.rows.reduce((acc, { workout_datetime }) => {
            const dateKey = workout_datetime.toISOString().split('T')[0];
            const time = new Date(workout_datetime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            const dateEntry = acc.find(entry => entry.date === dateKey);
            if (dateEntry) {
                dateEntry.slots.push(time);
            } else {
                acc.push({ date: dateKey, slots: [time] });
            }
            return acc;
        }, []);

        return new Response(JSON.stringify({
            availableSlots,
            scheduled,
            name: user.name,
        }), { status: 200 });

    } catch (error) {
        console.error('error:' + error);
        return new Response('Internal Server Error', {status: 500})
    }

}