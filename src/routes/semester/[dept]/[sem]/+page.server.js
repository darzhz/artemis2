import { json } from '@sveltejs/kit';
import { executeQuery } from '../../../../lib/db/database';
import { POST } from './+server';
/** @type {import('./$types').PageLoad} */
export async function load( {params} ) {
    return {
        db: {
            subjects: await executeQuery('SELECT * FROM subjects'),
            basket: await executeQuery('SELECT * FROM basket where department=? and semester=?', [params.dept, params.sem]),
            facultyAssigned: await executeQuery('SELECT * FROM facultyoperation where department=? and semester=?', [params.dept, params.sem]),
            batches: await executeQuery(`SELECT b.*, COUNT(s.id) AS noOfStudents FROM batches b LEFT JOIN students s ON b.name = s.batch AND b.department = s.department WHERE b.department = '${params.dept}' AND b.semester = '${params.sem}' GROUP BY b.name`),
        },
        thisPage: {
            dept: params.dept,
            sem: params.sem
        },
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    update: async ({params, body}) => {
        console.log(json(body));
    }
};
