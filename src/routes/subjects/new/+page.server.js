import { runQuery } from "../../../lib/db/database";
import fs from 'fs';

/** @type {import('./$types').Actions} */
export const actions = {
    create: async ({ request }) => { // Use request object here
        const data = await request.formData(); // Access form data
        const code = data.get('coursecode');
        const name = data.get('name');
        const department = data.get('department');
        const description = data.get('description');
        const syllabus = data.get('syllabus');
        const type = data.get('type');
        console.log(`Subject ${name} registered successfully`);
        try {
            const syllabusContent = await syllabus.text();
            fs.writeFileSync(`static/syllabus/${code}.syllabus`,syllabusContent);
            console.log(syllabusContent);
            // Save the subject data to the database
            await runQuery(
                `INSERT INTO subjects (code, name, department, description, type) VALUES (?, ?, ?, ?, ?)`,
                [code, name, department, description, type]
            );
            console.log(`Subject ${name} registered successfully`);
            return {
                status: 200,
                body: {
                    message: `Subject ${name} registered successfully`
                }
            };
        } catch (e) {
            console.error(`Error registering subject ${name}`, e);
            return {
                status: 500,
                body: {
                    message: `Error registering subject ${name}`
                }
            };
        }
    },
};
