import { executeQuery } from '../../../../lib/db/database';
import fs from 'fs';
/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const subData = await executeQuery('SELECT * FROM subjects WHERE id = ?', [params.slug]);
    return {
        db: {
            subjectData: subData,
            syllabus:  fs.readFileSync(`static/syllabus/${subData[0].code}.syllabus`, 'utf-8'),
            slug: params.slug
        }
    };
}
/** @type {import('./$types').Actions} */
export const actions = {
    update : async ({ request,params }) => {
        const data = await request.formData();
        const name = data.get('name');
        const code = data.get('coursecode');
        const description = data.get('description');
        const syllabus = data.get('syllabus');
        await executeQuery('UPDATE subjects SET name = ?, code = ?, description = ? WHERE id = ?', [name, code, description, params.slug]);
        console.log("updation on subjects table done");
        const syllabusContent = await syllabus.text();
        if(syllabusContent.length > 0) {
        fs.writeFileSync(`static/syllabus/${params.slug}.syllabus`, syllabusContent);
        }
        return {
            status: 303,
            headers: {
                location: `/subjects`
            }
        };
    },
    // async updateSubject({ params, body }) {
    //     await executeQuery('UPDATE subjects SET name = ?, code = ?, description = ? WHERE id = ?', [body.name, body.code, body.description, params.slug]);
    // },
    // async updateSyllabus({ params, body }) {
    //     fs.writeFileSync(`static/syllabus/${params.slug}.syllabus`, body.syllabus);
    // }
};