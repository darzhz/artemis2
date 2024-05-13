import { executeQuery, runQuery } from '../../lib/db/database';
import fs from 'fs';
/** @type {import('./$types').PageLoad} */
export async function load({params}) {
    return {
        db : {
        }
    }
}
/** @type {import('./$types').Actions} */
export const actions = {
    getTimeTable : async ({request}) => {
        const data = await request.formData();
        const userId = data.get('userId');
        console.log("Received userId",userId);
        try{
            // const output = await executeQuery(`SELECT t.*, b.subjects FROM timetable t JOIN facultyoperation fo ON t.batch_id = fo.batch_id JOIN batches b ON t.batch_id = b.name WHERE fo.faculty_id = ?;`,[userId]);
            const output = await executeQuery(`SELECT t.*,b.subjects as allSubjects,GROUP_CONCAT(fo.subject_id) AS subjects FROM timetable t JOIN facultyoperation fo ON t.batch_id = fo.batch_id JOIN batches b ON t.batch_id = b.name WHERE fo.faculty_id = ? GROUP BY t.batch_id;`,[userId]);
            console.log("Output subjects",output);
            return {
                body : JSON.stringify(output)
            }
        }catch(e){
            console.error("Error in getTimeTable",e);
            return {
                status : 500,
                body : null
            }
        }
    },
    getStudents : async ({request}) => {
        const data = await request.formData();
        const batchName = data.get('batchName');
        console.log("Received batchId",batchName);
        try{
            const output = await executeQuery(`SELECT * FROM students WHERE batch = ?;`,[batchName]);
            return {
                body : JSON.stringify(output)
            }
        }catch(e){
            console.error("Error in getStudents",e);
            return {
                status : 500,
                body : null
            }
        }
    },
    save : async ({request}) => {
        const data = await request.formData();
        let attendanceData = data.get('attendanceData');
        console.log("Received data",attendanceData);
        attendanceData = JSON.parse(attendanceData);
        for (const record of attendanceData) {
            const { id, name, subject, period, batch, date, status,topic,dept,facultyid } = record;
            // Replace with your actual database interaction logic
            console.log(`Saving attendance record for student: ${id}, name: ${name}`);
            runQuery(`INSERT or REPLACE INTO attendance (student_id, subject_code, date, period, status, batch) VALUES (?, ?, ?, ?, ?, ?);`, [id, subject, date, period, status, batch]);
            //insert into lessonplan table
            /*
            CREATE TABLE IF NOT EXISTS lessonplan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    subject TEXT NOT NULL,
    department TEXT NOT NULL,
    facultyid INTEGER NOT NULL,
    topic TEXT NOT NULL,
    hour INTEGER NOT NULL
);
            */
            // Here's an example using a hypothetical `insertAttendance` function 
            // (replace this with your database integration)
            // await insertAttendance(id, subject, date, period, status, batch);
          }
          const { id, name, subject, period, batch, date, status,topic,dept,facultyid } = attendanceData[0];
          runQuery(`INSERT INTO lessonplan (date,subject,department,facultyid,topic,hour) VALUES (?,?,?,?,?,?);`,[date,subject,'CSE',facultyid,topic,period]);

    },
    getLessonPlan : async ({request}) => {
        const data = await request.formData();
        const subject = data.get('subject');
        const batch = data.get('batchName');
        const hours = data.get('hour');
        console.log("Received subject",subject,batch,hours);
        //open a file from /syllabus/subject.syllabus
        //read the file and return the content
        const content = fs.readFileSync(`static/syllabus/${subject}.syllabus`, 'utf8' , (err, data) => {
            if (err) {
              console.error(err)
              return {
                  status : 500,
                  body : null
              }
            }
            // console.log(data)
            return data;
          })
          const generatedArary = content.split("\n").map((line) => {
              return line.split(",");
          });
          console.log("Content",generatedArary);
          return {
              body : JSON.stringify(generatedArary)
          }
        
    },
    getpreviousAttendance : async ({request}) => {
        const data = await request.formData();
        const batch = data.get('batchName');
        const subject = data.get('subject');
        const hour = data.get('hour');
        const date = data.get('date');
        const dept = data.get('dept');
        console.log("Received studentId",batch,subject,hour,date,dept);
        try{
            const output = await executeQuery(`SELECT * FROM attendance WHERE batch = ? AND subject_code = ? AND date = ? AND period = ?;`,[batch,subject,date,hour]);
            return {
                body : JSON.stringify(output)
            }
        }catch(e){
            console.error("Error in getpreviousAttendance",e);
            return {
                status : 500,
                body : null
            }
        }
        
    }
};