import { runQuery } from '../../../../lib/db/database';
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const data = await request.json();
    try{
        console.log(data);
        // insert data into Basket table INSERT INTO basket (department, semester, subject) VALUES (?, ?, ?)
        //an upsert would be better here like when subjects are added to the basket
        await runQuery(
            `INSERT OR REPLACE INTO basket (department, semester, subjects) VALUES (?, ?, ?)`,
            [data.dept, data.sem, data.subject.toString()]
        );
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