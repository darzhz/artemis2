import { executeQuery } from '../../../../../lib/db/database';
/** @type {import('./$types').PageLoad} */
export async function load({params}) {
    return {
        db: {
            students: await executeQuery('SELECT * FROM students where batch is null'),
            faculty: await executeQuery('SELECT * FROM faculty where batch is null'),
            subjectsInSem: await executeQuery('SELECT subjects FROM Basket where semester=? and department=?', [parseInt(params.sem), params.dept.toUpperCase()]),
        },
        thisPage: {
            dept: params.dept,
            sem: params.sem
        },
    };
}