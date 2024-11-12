import { sql } from '@vercel/postgres';
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { authMiddleware } from "@/lib/server/utils";
import { streamToJSON } from "@/lib/server/utils";

export async function POST(req) {
    const cookieserver = await cookies();
    const response = await authMiddleware(cookieserver);
    if (response) {
        return response;
    }

    const email = cookieserver.get('email')?.value;
    const json = await streamToJSON(req.body);
    const date = json.date
    const time = json.time
    console.log(date + time)

    if (!email || !date || !time) {
        return new Response(JSON.stringify({ error: 'Email, date, and time are required.' }), { status: 400 });
    }

    const workoutDateTime = new Date(`${date} ${time}`);
    console.log(workoutDateTime.toISOString());

    try {
        const userResult = await sql`
            SELECT user_id, name FROM Users WHERE email = ${email};
        `;
        if (userResult.rows.length === 0) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }
        const user = userResult.rows[0];

        const workoutResult = await sql`
            SELECT workout_id, capacity FROM Workouts WHERE workout_datetime = ${workoutDateTime.toISOString()};
        `;
        if (workoutResult.rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Workout not found at the specified date and time' }), { status: 404 });
        }
        const workout = workoutResult.rows[0];

        const slotResult = await sql`
            SELECT available_slots FROM Workout_Slots WHERE workout_id = ${workout.workout_id};
        `;
        if (slotResult.rows.length === 0 || slotResult.rows[0].available_slots <= 0) {
            return new Response(JSON.stringify({ error: 'No available slots for this workout' }), { status: 400 });
        }

        const existingScheduleResult = await sql`
            SELECT * FROM User_Workouts
            WHERE user_id = ${user.user_id} AND workout_id = ${workout.workout_id} AND status = 'scheduled';
        `;
        if (existingScheduleResult.rows.length > 0) {
            return new Response(JSON.stringify({ error: 'User is already scheduled for this workout' }), { status: 400 });
        }

        await sql`
             INSERT INTO User_Workouts (user_id, workout_id, status)
             VALUES (${user.user_id}, ${workout.workout_id}, 'scheduled');
        `;
        await sql`
            UPDATE Workout_Slots
            SET available_slots = available_slots - 1
            WHERE workout_id = ${workout.workout_id};
        `;


        return new Response(JSON.stringify({
            message: 'Workout scheduled successfully',
            user: user.name,
            workout_datetime: workoutDateTime,
        }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}