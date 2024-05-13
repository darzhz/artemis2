import { runQuery } from "../../../../../lib/db/database";
export async function POST({ request }) {
    const data = await request.json();
    try{
        console.log(data);
        // insert data into batch table INSERT INTO batch (name, department, year) VALUES (?, ?, ?)
        runQuery(
            `INSERT INTO batches (name, department, year,facultyIncharge,subjects,semester) VALUES (?, ?, ?, ?, ?, ?)`,
            [data.name, data.dept, data.year,data.facultyIncharge,data.subjects.toString(),data.sem]
        );
        //data.students is an array with student details long with their id lets get those ids and update their batch
        data.students.forEach(async (student) => {
            await runQuery(
                `UPDATE students SET batch=? WHERE id=?`,
                [data.name, student.id]
            );
        });

    }catch(err){
        return new Response(JSON.stringify({
            status: 500,
            body: {
                message: `Database Error ${err.message}`
            }
        })
        );
    }
    
    return new Response(JSON.stringify({
        status: 200,
        body: {
            message: 'Data received'
        }
    }));
}