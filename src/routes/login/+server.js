import { executeQuery } from '../../lib/db/database.js';
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    console.log("POST /login/+server.js with");
    // Get the user from the request body
    const { email,password } = await request.json();
    // Get the user from the database
    try {
        const user = await executeQuery('SELECT * FROM faculty WHERE email = ? AND password = ?',[email,password]);
        console.log("user",user);
        if (user.length === 0) {
            return new Response(null, { status: 401 });
        }
        return new Response(JSON.stringify(user[0]));
    } catch (error) {
        console.error("Error in login/+server.js", error);
        return new Response(null, { status: 500 });
    }
}