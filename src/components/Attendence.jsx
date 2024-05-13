import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import './styles/header.css';

const ClassroomGrid = ({ props, selectedDate }) => {
  console.log('props',props);
  const [batchName, setBatchName] = useState(props);
	useEffect(() => {
		// Fetch the initial total number of students in the batch
		console.log('batchName -', batchName);
		getInitialTotalStudents().then((totalStudents) => {
			setStudents(Array(totalStudents).fill('present'));
		});
	}, [batchName]);
	const getInitialTotalStudents = async () => {
		// Adjust the initial number of students based on the screen size
		//return 60;
		//fetch a form action in /attendence?/getStudents by passing batchName in formdata
		const formData = new FormData();
		let students = [];
		formData.append('batchName', batchName);
		const resp = await fetch('/attendence?/getStudents', {
			method: 'POST',
			body: formData
		});
		const data = await resp.json();
		students = await JSON.parse(JSON.parse(data.data)[1]);
    console.log('students', students,JSON.parse(JSON.parse(data.data)[1]));
		return 60;
	};

	const initializeStudents = () => {
		// Initialize the students array with 'present' status initially
		return Array(getInitialTotalStudents()).fill('present');
	};
	const [students, setStudents] = useState(initializeStudents);
	const [confirmationMessage, setConfirmationMessage] = useState([]);
	const [rollNumbersInput, setRollNumbersInput] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('present');

	const handleStudentClick = (index) => {
		// Toggle the student status (present/absent/onDuty) when clicked
		setStudents((prevStudents) => {
			const updatedStudents = [...prevStudents];
			const statusMapping = {
				present: 'absent',
				absent: 'onDuty',
				onDuty: 'present'
			};
			updatedStudents[index] = statusMapping[prevStudents[index]];
			return updatedStudents;
		});
	};

	const handleRollNumbersChange = useCallback((event) => {
		setRollNumbersInput(event.target.value);
	}, []);
	const handleStatusChange = (event) => {
		setSelectedStatus(event.target.value);
	};

	const applyStatusToSelectedRollNumbers = () => {
		console.log('update issued');
		const rollNumbersArray = rollNumbersInput
			.split(',')
			.map((number) => parseInt(number.trim(), 10));

		setStudents((prevStudents) => {
			const updatedStudents = [...prevStudents];
			rollNumbersArray.forEach((rollNumber) => {
				if (rollNumber >= 1 && rollNumber <= updatedStudents.length) {
					updatedStudents[rollNumber - 1] = selectedStatus;
				}
			});
			return updatedStudents;
		});
		setRollNumbersInput('');
	};
	const getStatusColorClass = (status) => {
		switch (status) {
			case 'present':
				return 'present-color';
			case 'absent':
				return 'absent-color';
			case 'onDuty':
				return 'onDuty-color';
			default:
				return '';
		}
	};
	return (
		<>
			<div className="classroom-grid">
				{Array.from({ length: Math.ceil(students.length / 3) }).map((_, benchIndex) => (
					<div key={benchIndex} className="bench">
						{Array.from({ length: 3 }).map((_, studentIndex) => {
							const index = benchIndex * 3 + studentIndex;
							if (index < students.length) {
								const studentStatus = students[index];
								return (
									<div
										key={index}
										className={`student-box ${studentStatus}`}
										onClick={() => handleStudentClick(index)}
									>
										Student {index + 1}
									</div>
								);
							} else {
								return null; // Render nothing if the seat doesn't exist
							}
						})}
					</div>
				))}
			</div>

			<div className="controls">
				<select value={selectedStatus} onChange={handleStatusChange}>
					<option value="present">Present</option>
					<option value="absent">Absent</option>
					<option value="onDuty">On Duty</option>
				</select>
				<input
					type="text"
					placeholder="Enter roll numbers (e.g., 1, 3, 5)"
					value={rollNumbersInput}
					onInputCapture={handleRollNumbersChange}
				/>
				<button onClick={applyStatusToSelectedRollNumbers}>Update</button>
			</div>
		</>
	);
};

const Attendence = (props) => {
	console.log(props.props.inputArray);
	return (
		<>
			<ClassroomGrid props={props.props.inputArray} selectedDate={'11/04/2020'} />
		</>
	);
};
export default Attendence;
