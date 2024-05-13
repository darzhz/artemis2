//used to get the subjects for the page from the database
import { executeQuery } from '../../lib/db/database';
/** @type {import('./$types').PageLoad} */
export async function load() {
    return {
        db: {
            subjects: await executeQuery('SELECT * FROM subjects')
        }
    };
}