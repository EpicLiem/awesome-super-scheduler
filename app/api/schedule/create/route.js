import { sql } from '@vercel/postgres';
import bcrypt from "bcrypt";
import {cookies} from "next/headers";
import {authMiddleware} from "@/lib/server/utils";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const response = await authMiddleware(cookies());
    if (response) {
        return response;
    }
    const email = cookies().get('email').value;
    const { date, time } = req.body;

    if (!email || !date || !time) {
        return res.status(400).json({ error: 'Email, date, and time are required.' });
    }

    // Construct workout_datetime from date and time
    const workoutDateTime = new Date(`${date}T${time}:00Z`);

    try {
        // Step 1: Check if the user exists
        const userResult = await sql`
            SELECT user_id, name FROM Users WHERE email = ${email};
        `;
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = userResult.rows[0];

        // Step 2: Check if the workout exists at the specified datetime
        const workoutResult = await sql`
            SELECT workout_id, capacity FROM Workouts WHERE workout_datetime = ${workoutDateTime};
        `;
        if (workoutResult.rows.length === 0) {
            return res.status(404).json({ error: 'Workout not found at the specified date and time' });
        }
        const workout = workoutResult.rows[0];

        // Step 3: Check if there are available slots
        const slotResult = await sql`
            SELECT available_slots FROM Workout_Slots WHERE workout_id = ${workout.workout_id};
        `;
        if (slotResult.rows.length === 0 || slotResult.rows[0].available_slots <= 0) {
            return res.status(400).json({ error: 'No available slots for this workout' });
        }

        // Step 4: Check if the user is already scheduled for this workout
        const existingScheduleResult = await sql`
            SELECT * FROM User_Workouts
            WHERE user_id = ${user.user_id} AND workout_id = ${workout.workout_id} AND status = 'scheduled';
        `;
        if (existingScheduleResult.rows.length > 0) {
            return res.status(400).json({ error: 'User is already scheduled for this workout' });
        }

        // Step 5: Schedule the user for the workout
        await sql.begin(async sql => {
            await sql`
                INSERT INTO User_Workouts (user_id, workout_id, status)
                VALUES (${user.user_id}, ${workout.workout_id}, 'scheduled');
            `;

            // Reduce available slots by 1
            await sql`
                UPDATE Workout_Slots
                SET available_slots = available_slots - 1
                WHERE workout_id = ${workout.workout_id};
            `;
        });

        // Success response
        res.status(200).json({
            message: 'Workout scheduled successfully',
            user: user.name,
            workout_datetime: workoutDateTime,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}