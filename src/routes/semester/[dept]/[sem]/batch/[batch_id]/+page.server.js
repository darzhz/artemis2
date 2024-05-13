import { executeQuery } from "../../../../../../lib/db/database"
/** @type {import('./$types').PageLoad} */
export async function load({params}) {
    return{
        db:{
            students: await executeQuery('SELECT * FROM students where batch=?', [params.batch_id]),
            subjects: await returnSubjectsFromSubjectsArrayDb(params.batch_id),
            facultyAssigned: await executeQuery(`SELECT * FROM facultyoperation where batch_id='${params.batch_id}'`),
            faculty: await executeQuery('SELECT id,name,department FROM faculty'),
            facultyInCharge: await executeQuery(`SELECT facultyIncharge FROM batches WHERE name='${params.batch_id}'`),
            timetable: await executeQuery(`SELECT * FROM timetable WHERE batch_id='${params.batch_id}'`),
        },
        thisPage:{
            dept: params.dept,
            sem: params.sem,
            batch_id: params.batch_id
        }
    }
}
const returnSubjectsFromSubjectsArrayDb = async (batch_id) => {
    const subjectsINbatch = await executeQuery('SELECT subjects FROM batches where name=?', [batch_id]);
    const allSubjects = await executeQuery('SELECT * FROM subjects');
    const subarray = subjectsINbatch[0].subjects.split(',');
    const subjects = [];
    allSubjects.forEach((subject) => {
        if(subarray.includes(subject.code.toString())){
            subjects.push(subject);
        }
    });
    return subjects;
}