import { runQuery } from '../../../../../../lib/db/database';
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const data = await request.json();
	try {
		console.log(data);
		Object.keys(data).forEach(async (key) => {
			await runQuery(
				`INSERT INTO facultyoperation (faculty_id, subject_id, batch_id, semester, department) VALUES (?, ?, ?, ?, ?)`,
				[
					data[key].faculty_id,
					data[key].subject_id,
					data[key].batch_id,
					data[key].sem,
					data[key].dept
				]
			);
		});
	} catch (err) {
		return new Response(
			JSON.stringify({
				status: 500,
				body: {
					message: `Database Error ${err.message}`
				}
			})
		);
	}
	return new Response(
		JSON.stringify({
			status: 200,
			body: {
				message: 'Data received'
			}
		})
	);
}
