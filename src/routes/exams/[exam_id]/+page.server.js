import { executeQuery } from '../../../lib/db/database'
/** @type {import('./$types').PageLoad} */
export async function load({params}) {
    return{
        db:{
            thisExam: await executeQuery(`SELECT * FROM exams WHERE exam_id = ?`, [params.exam_id]),
            subjectInfo: await executeQuery(`SELECT subjects FROM batches WHERE name = (SELECT batch FROM exams WHERE exam_id = ${params.exam_id});`),
            studentInfo: await executeQuery(`SELECT * FROM students WHERE batch=(select batch from exams WHERE exam_id= ${params.exam_id});`),
            thisMark: await executeQuery(`SELECT em.exam_id,em.subject_id,s.code,em.student_id,st.name, em.marks FROM exam_marks em JOIN subjects s ON em.subject_id = s.id JOIN students st ON em.student_id = st.id WHERE em.exam_id = ${params.exam_id};`)
        },
    }
}
/*
SELECT 
    em.exam_id,
    em.subject_id,
    s.code, -- Add subject code
    em.student_id,
    st.name, -- Add student name
    em.marks
FROM 
    exam_marks em
JOIN 
    subjects s ON em.subject_id = s.id -- Join with subjects table to get subject code
JOIN 
    students st ON em.student_id = st.id -- Join with students table to get student name
WHERE 
    em.exam_id = 9;
    */
/** @type {import('./$types').Actions} */
export const actions = {
    update: async ({request, params}) => {
        const data = await request.formData();
        const examId = params.exam_id;
        const studentId = data.get("student_id");
        const subjectId = data.get("subject_id");
        const marks = data.get("marks");
        console.log(examId, studentId, subjectId, marks);
        try{
            await executeQuery(`UPDATE exam_marks SET marks = ? WHERE exam_id = ? AND student_id = ? AND subject_id = ?`, [marks, examId, studentId, subjectId]);
            console.log("Updated marks successfully");
        }catch(error){
            console.error('Error updating marks:', error);
        }
    }
};