import { TimetableExcel } from './Generate.js';
import { runQuery } from '../../lib/db/database.js';
import { executeQuery } from '../../lib/db/database.js';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({params}) {
    return {
        db:{
            batch: await executeQuery('SELECT DISTINCT batch_id FROM timetable'),
        }
    }
}

//when a request is issued to the server, the server will respond with the file that is requested
/** @type {import('./$types').Actions} */
export const actions = {
    download: async ({ request, resp }) => {
        try {
            const data = await request.formData();
            const department = data.get('department');
            const semester = data.get('semester');
            const batch = data.get('batch');
            const type = data.get('type');
            const itemizedData = {
                department,
                semester,
                batch,
                type,
                facultyName: 'henry',
                designation: 'professor',
                courseCode: 'CS201',
                courseName: 'Data Structures',
                year: '2021',
                className: '53'
            };

            console.log(`Downloading ${type} report for ${department} department, semester ${semester}, batch ${batch}`);
            
            const filePath = await TimetableExcel(itemizedData);
            console.log('File path:', filePath);

            // Respond with the file download
            return {
                status: 200,
                body: {
                    message: filePath,
                    isLink: true
                }
            };
        } catch (error) {
            console.error('Error:', error.message);
            return {
                status: 500,
                body: {
                    error: 'Internal Server Error'
                }
            };
        }
    },
    downloadRaw: async ({ request, resp }) => {
        try {
            const data = await request.formData();
            const department = data.get('dept');
            const semester = data.get('semester');
            const batch = data.get('batch');
            const type = data.get('type');
            const facultyName = data.get('facultyName');
            const designation = data.get('designation');
            const courseCode = data.get('courseCode');
            const courseName = data.get('courseName');
            const year = data.get('year');
            console.log(data);
            const itemizedData = {
                department,
                semester,
                batch,
                type,
                facultyName: facultyName,
                designation: designation,
                courseCode: courseCode,
                courseName: courseName,
                year: year,
                className: batch,
                subjects: JSON.parse(data.get('subjects'))
            };

            console.log(`Downloading ${type} report for ${department} department, semester ${semester}, batch ${batch}`);
            
            const filePath = await TimetableExcel(itemizedData);
            console.log('File path:', filePath);
            try {
                // save data to Database
                // cREATE TABLE IF NOT EXISTS timetable (
                //     id INTEGER PRIMARY KEY AUTOINCREMENT,
                //     department TEXT NOT NULL,
                //     semester TEXT NOT NULL,
                //     batch_id TEXT NOT NULL,
                //     timetable TEXT NOT NULL,
                //     tbl_fileName TEXT NOT NULL,
                //     UNIQUE(department,semester,batch_id)
                // );
                await runQuery(`INSERT OR REPLACE INTO timetable (department, semester, batch_id, timetable, tbl_fileName) VALUES (?, ?, ?, ?, ?)`,
                    [department, semester, batch, JSON.stringify(itemizedData.subjects), filePath]
                );
            } catch (error) {
                console.error('Error:', error.message);
                return {
                    status: 500,
                    body: {
                        error: 'Internal Server Error : Database Error at timetable insertion'
                    }
                };
            }
            //Respond with the file download
            return {
                status: 200,
                body: {
                    message: filePath,
                    isLink: true
                }
            };
        } catch (error) {
            console.error('Error:', error.message);
            return {
                status: 500,
                body: {
                    error: 'Internal Server Error'
                }
            };
        }
    },
    getData: async ({ request, resp}) => {
        const data = await request.formData();
        let batches = await executeQuery('SELECT DISTINCT batch_id FROM timetable where department = ? and semester = ?', [data.get('department').toUpperCase(), data.get('semester')]);
        let batchList = [];
        batches.forEach(element => {
            batchList.push(element.batch_id);
        });
        console.log(batchList);
        const jsonData = JSON.stringify(batchList);
        return {
            status: 200,
            jsonData
            
        };
    },
};