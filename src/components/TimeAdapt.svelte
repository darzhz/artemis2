<script>
    import  { ReactAdapter } from "svelte-react-kit";
    import Timetable from "./Timetable.jsx";
    export let  subject = [[
    {
        "id": 3,
        "name": "Introduction to Programming",
        "code": "CSE101",
        "department": "CSE",
        "description": "An introductory course covering basic programming concepts and problem-solving techniques using a programming language such as Python or Java.",
        "type": "lecture"
    },
    {
        "id": 4,
        "name": "Data Structures and Algorithms",
        "code": "CSE201",
        "department": "CSE",
        "description": "Study of fundamental data structures like arrays, linked lists, trees, and algorithms for sorting, searching, and graph traversal.",
        "type": "lecture"
    },
    {
        "id": 5,
        "name": "Database Management Systems",
        "code": "CSE301",
        "department": "CSE",
        "description": "An overview of database management systems, focusing on relational database concepts, SQL, and database design.",
        "type": "lecture"
    },
    {
        "id": 31,
        "name": "Robotics",
        "code": "CSE723",
        "department": "CSE",
        "description": "Introduction to robotics principles, including robot kinematics, dynamics, motion planning, and control.",
        "type": "lecture"
    }
]];
export let faculty = 'Faculty 1';
export let sem = 3;
export let dept = 'CSE';
export let batch = 'B1';
export let initialArray = [
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ]
]

let props = {
    subjects: subject,
    faculty: faculty,
    sem: sem,
    dept:dept,
    batch:batch,
    initialArray:initialArray
}
</script>
<ReactAdapter
  el={Timetable}
  class="mui-btn"
  props={ props }
  children="Hello"
  variant="contained"
  color="primary"
  onClick={() => alert("hello world!")}
/>