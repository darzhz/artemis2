import { runQuery } from "../../lib/db/database";
import { executeQuery } from "../../lib/db/database";
import { runTransaction } from "../../lib/db/database";

/** @type {import('./$types').PageLoad} */
export async function load({params}) {
    return {
        db: {
            allExams: await executeQuery(`SELECT * FROM exams`),
            gradedExams: await executeQuery(`SELECT em.exam_id, e.exam_type, e.exam_date, (SELECT COUNT(marks) FROM exam_marks WHERE exam_id = em.exam_id) AS graded, (SELECT COUNT(exam_id) FROM exam_marks WHERE exam_id = em.exam_id) AS total FROM exams e JOIN exam_marks em ON e.exam_id = em.exam_id GROUP by e.exam_id`)
        },
    };
}
// SELECT 
//     em.exam_id,
//     e.exam_type,
//     e.exam_date,
//     (
//         SELECT COUNT(marks) 
//         FROM exam_marks 
//         WHERE exam_id = em.exam_id
//     ) AS graded,
//     (
//         SELECT COUNT(exam_id) 
//         FROM exam_marks 
//         WHERE exam_id = em.exam_id
//     ) AS total
// FROM 
//     exams e
// JOIN 
//     exam_marks em ON e.exam_id = em.exam_id GROUP by e.exam_id

/** @type {import('./$types').Actions} */
export const actions = {
    create  : async ({request}) => {
        const data = await request.formData();
        const examType =  data.get("examType");
        const maxMark = data.get("maxMark");
        const minMark = data.get("minMark");
        const examDate = data.get("examDate");
        const department = data.get("department");
        const semester = data.get("semester");
        const batch = data.get("batch")
        /*
        CREATE TABLE IF NOT EXISTS exams (
            exam_id	INTEGER NOT NULL,
            exam_type	TEXT NOT NULL,
            max_mark	REAL NOT NULL,
            min_mark	REAL NOT NULL,
            exam_date	TEXT NOT NULL,
            department	TEXT NOT NULL,
            semester	TEXT NOT NULL,
            batch	TEXT NOT NULL,
            UNIQUE(batch,semester,department,exam_date),
            PRIMARY KEY(exam_id AUTOINCREMENT)
        );
        CREATE TABLE exam_marks (
            exam_id	INTEGER NOT NULL,
            subject_id	INTEGER NOT NULL,
            student_id	INTEGER NOT NULL,
            marks	REAL,
            UNIQUE(exam_id,subject_id,student_id),
            FOREIGN KEY(exam_id) REFERENCES exams(exam_id)
        );
        */
        //Inserting data into exams table
        try {
            // await runQuery(
            //     `INSERT INTO exams (exam_type, max_mark, min_mark, exam_date, department, semester, batch) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            //     [examType, maxMark, minMark, examDate, department, semester, batch]
            // );
            const subjects = await executeQuery(`SELECT subjects FROM batches WHERE name = ?`, [batch]);
            const students = await executeQuery(`SELECT id FROM students WHERE batch = ?`, [batch]);
            const nextExamIdResult = await executeQuery(`SELECT seq FROM sqlite_sequence WHERE name='exams'`);
            const allSubjects = await executeQuery(`SELECT * FROM subjects`);
            const nextExamId = parseInt(nextExamIdResult[0].seq)+1;
            console.log(allSubjects,typeof allSubjects)
            console.log("printing",nextExamId);
            const subjectArray = subjects[0].subjects.split(",");
            const queries = [
                {
                    query: `INSERT INTO exams (exam_type, max_mark, min_mark, exam_date, department, semester, batch) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    params: [examType, maxMark, minMark, examDate, department, semester, batch]
                }
            ];
            for (const subject of subjectArray) {
                for (const student of students) {
                    queries.push({
                        query: `INSERT INTO exam_marks (exam_id, subject_id, student_id) VALUES (?, ?, ?)`,
                        params: [nextExamId,subjectCodeToId(subject,allSubjects), student.id]
                    });
                }
            }
            await runTransaction(queries);
            console.log(queries);
            console.log(`Exam ${examType} added successfully`);
            return {
                status: 200,
                body: {
                    message: `Exam ${examType} added successfully`
                }
            };
        } catch (e) {
            console.error(`Error adding exam ${examType}`, e);
            return {
                status: 500,
                body: {
                    message: `Error adding exam ${examType}`
                }
            };
        }
    }
};
const subjectCodeToId = (subjectCode, allSubjects) => {
    for (const subject of Object.keys(allSubjects)) {
        if (allSubjects[subject].code === subjectCode) {
            return allSubjects[subject].id;
        }
    }
}
