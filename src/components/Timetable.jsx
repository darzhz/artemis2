import React, { useEffect, useState } from "react";
import "./styles/header.css";
//import sendData from '../utils/utils'
export default function Timetable({props}) {
  let weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [subQueue, setSubQueue] = useState([]);
  const [selected, setSelected] = useState("N/A");
  const [freeHoursData, setFreeHoursData] = useState({});
  const initialArray = Array(7)
    .fill(null)
    .map(() => Array(weekDays.length + 1).fill(null));
  const [subjects, setSubjects] = useState(props.initialArray);
  const isNull = (item) => {
    return item == null ? "N/A" : item;
  };
  const handleSelection = (e) => {
    const item = e.target.getAttribute("item");
    fetchFreeHours();
    console.log(item);
    setSelected(item);
  };
  const handleReset = () => {
    setSubjects(initialArray);
  };
  const save = () => {
    console.log(convertTimetableToJson(subjects));
    //sendData(convertTimetableToJson(subjects),'/api/class/saveTable');
  }
  const [semester,setSemester] = useState(1);
  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
  }
  const handleClick = (e) => {
    const row = e.target.getAttribute("row");
    const col = e.target.getAttribute("col");
    const subject = e.target.getAttribute("subject");
    console.log(
      `Selected ${weekDays[row]} : period ${col} active Selection: ${selected} with subject ${subject}`
    );
    const psudoSelected = subject !== null ? null : selected;
    // Create a new array with the selected cell updated
    const newSubjects = subjects.map((rowArray, rowIndex) =>
      row === rowIndex.toString()
        ? rowArray.map((subject, colIndex) =>
            col === colIndex.toString() ? psudoSelected : subject
          )
        : rowArray
    );
    // Update the state with the new array
    console.log(newSubjects);
    setSubjects(newSubjects);
  };
  const [subjectlist, setSubjectlist] = useState(props.subjects);
  //FIXME ABSTRACT THE FUNCTION TO PARENT COMPONENT
  const convertJsonToTimetable = (input) => {
    let weekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let initialArray = Array(7)
      .fill(null)
      .map(() => Array(weekDays.length + 1).fill(null));
    input.forEach((item) => {
      const row = item.period - 1;
      const col = weekDays.indexOf(item.day);
      initialArray[row][col] = item.class_name + " " + item.faculty_id;
      initialArray[row][col] = item.code + " " + item.faculty_id;
    });
    console.log(initialArray);
  };
  // done

  const convertTimetableToJson = (initialArray) => {
    const weekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const jsonResult = [];

    initialArray.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          const [subCode, faculty_id] = cell.split(" ");
          const day = weekDays[colIndex];
          const period = rowIndex + 1;

          jsonResult.push({
            day,
            period,
            class_name: "cs01",
            faculty_id: parseInt(faculty_id),
            dept_name: "CSE",
            code: subCode,
          });
        }
      });
    });

    return jsonResult;
  };
  const [selectedItem, setSelectedItem] = useState("");
  const handleSelectChange = (e) => {
    const selectedValue =
      e.target.value + " " + e.target[e.target.selectedIndex].dataset.attribute;
    console.log(e.target[e.target.selectedIndex].dataset.attribute);
    setSelectedItem(selectedValue);
  };
  const fetchFreeHours = async () => {
    try {
      const selectedFaculty = parseInt(selected.split(" ")[1]);
      if (isNaN(selectedFaculty)) {
        return;
      }
      const response = await fetch(
        `/api/class/getFacultyFreeHours/${selectedFaculty}`
      );
      const data = await response.json();
      setFreeHoursData(data);
    } catch (error) {
      console.error("Error fetching free hours data:", error);
    }
  };
  const isFreeHour = (row, col) => {
    const allDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const day = allDays[row];
    const hour = col + 1;
    return freeHoursData[day] && freeHoursData[day].includes(hour);
  };
  
  const generateTable = async () => {
    const formData = new FormData();
    console.log(props);
    formData.append('facultyName', props.faculty[0].facultyIncharge);
    formData.append('courseCode', 'none');
    formData.append('courseName', props.dept);
    formData.append('dept', props.dept);
    formData.append('Year', new Date().getFullYear());
    formData.append('designation', 'professor');
    formData.append('semester', props.sem);
    formData.append('batch', props.batch);
    formData.append('subjects', JSON.stringify(subjects));

    try {
        const response = await fetch('/downloads?/downloadRaw', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Assuming the server responds with the correct content type for the file (e.g., 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        const blob = await response.json();
        const file = await JSON.parse(blob.data)[3];

        const downloadLink = document.createElement('a');
        downloadLink.href = `/downloads/${file}`;
        downloadLink.download = 'timetable.xlsx';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

    } catch (error) {
        console.error('Error generating timetable:', error);
    }
};

  console.log(subjectlist)
  let subQ = Object.keys(subjectlist[0]).map((item, i) => {
    return subjectlist[0][item].code;
  });
  console.log("subQ",subQ);
//   useEffect(() => {
//     const update = async () => {
//       let data = await fetchData();
//       setSubjectlist(data);
//       console.log(subjectlist);
//     };
//     update();
//   }, []);
  return (
    <div className="grid-container">
      <div className="overflow-container">
        <h2 className="text-lg font-semibold">Subjects</h2>
        <p className="day">Currently Selected : {selected || "N/A"}</p>
        <div className="grid gap-4">
          {Object.keys(subjectlist[0]).map((item, i) => (
            <div
              className={`p-4 border rounded-md cursor-move subject${i} ${selected === subjectlist[0][i].code ? "active" : ""}`}
              item={subjectlist[0][item].code}
              key={i}
              onClick={handleSelection}
            >
              {subjectlist[0][item].name}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Timetable</h2>
        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((hour, hourIndex) => (
            <div className="col-span-1" key={hourIndex}>{` Hr ${hour}`}</div>
          ))}
          {weekDays.map((item, i) => (
            <>
              {subjects.map((subs, subIndex) => (
                <div
                  row={i}
                  col={subIndex}
                  className={`col-span-1 border rounded-md Box TBox subject${subQ.indexOf(subjects[i][subIndex])} ${isFreeHour(i, subIndex) ? "free-hour" : ""}`}
                  key={subIndex}
                  onClick={handleClick}
                  subject={subjects[i][subIndex]}
                >
                  <sub row={i} col={subIndex} id="subIndex" subject={subjects[i][subIndex]}>
                    {item}
                  </sub>
                  <span
                    row={i}
                    col={subIndex}
                    id="subIndex"
                    className="day"
                    subject={subjects[i][subIndex]}
                  >
                    {isNull(subjects[i][subIndex])}
                  </span>
                </div>
                
              ))}
            </>
          ))}
        </div>
        <div className="control">
          <button className="btn btn-outline btn-warning" onClick={handleReset}>
            reset
          </button>
          <button className="btn btn-outline btn-info" onClick={generateTable}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}