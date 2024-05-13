/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const data = await request.json();
    console.log(data);
    
    return new Response(JSON.stringify({
        status: 200,
        body: {
            message: 'Data received'
        }
    }));
}
const TimetableExcel = async(data,req,res) => {
    let downloadFile = '';
    const workbook = new exceljs.Workbook();
    console.log('generating Timetable');
    const courseCode = 'D3';
    const courseName = 'F3:H3';
    const year = 'J3';
    const className = 'L3';
    const facultyName = 'B4:D4';
    const designation = 'F4:H4';
    const semester = 'J4';
    const Timedata = [
      [
          "mecon 63",
          "mecon 63",
          "mecon 63",
          "mecon 63",
          "CS201 53",
          "CS201 53",
          "mecon 63"
      ],
      [
          "mecon 63",
          "CS202 53",
          "CS202 53",
          "CS202 53",
          "CS202 53",
          "CS201 53",
          "mecon 63"
      ],
      [
          "mecon 63",
          "CS201 53",
          "CS202 53",
          "CS202 53",
          "CS202 53",
          "CS201 53",
          "CS201 53"
      ],
      [
          "mecon 63",
          "CS201 53",
          "mecon 63",
          "mecon 63",
          "mecon 63",
          "CS201 53",
          "CS202 53"
      ],
      [
          "mecon 63",
          "CS201 53",
          "CS202 53",
          "CS202 53",
          "CS202 53",
          "CS201 53",
          "CS202 53"
      ],
      [
          "CS201 53",
          "CS202 53",
          "CS202 53",
          "CS201 53",
          "CS202 53",
          "CS202 53",
          "CS202 53"
      ]
  ]
  
   let result = await workbook.xlsx.readFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '/report/TIME_TABLE.xlsx'))
        .then(() => {
          const worksheet = workbook.getWorksheet(1);
            worksheet.getCell(facultyName).value = data.facultyName;
            worksheet.getCell(designation).value = data.designation; 
            worksheet.getCell(semester).value = data.semester; 
            worksheet.getCell(courseCode).value = data.courseCode;
            worksheet.getCell(courseName).value = data.courceName;
            worksheet.getCell(year).value = data.Year; 
            worksheet.getCell(className).value = data.batch; 
            //time table starts with c8 and ends at j8 while skiping  all H
            let timetableRow = 8;
            let timetableColumn = 3;
      
            Timedata.forEach((row) => {
              row.forEach((cell) => {
                // Skip column H
                if (timetableColumn !== 8) {
                  worksheet.getCell(`${getExcelLetter(timetableColumn)}${timetableRow}`).value = cell;
                }else{
                  worksheet.getCell(`${getExcelLetter(timetableColumn+1)}${timetableRow}`).value = cell;
                  timetableColumn++;
                }
                timetableColumn++;
              });
              timetableColumn = 3; // Reset column for the next row
              timetableRow++;
            });
            //last row starts at c13 and ends at j13 while skiping  all H
            const filename = generateUniqueFileName();
            const outfile = path.join(path.dirname(fileURLToPath(import.meta.url)),'../../../static/downloads', filename);

            // Pipe the workbook directly to the response
            return workbook.xlsx.writeFile(outfile).then(() => {
              console.log('File is written');
              return `<a href="/downloads/${filename}" download>Download ${filename}</a>`;
            });
        })
        .catch((error) => {
            console.error('Error:', error.message);
            return 'Internal Server Error';
        });
    return result;
  }