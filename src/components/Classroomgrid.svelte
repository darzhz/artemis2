<script>
	import { onMount, afterUpdate } from 'svelte';
  import Modal from './Modal.svelte';
	import { get } from 'svelte/store';
  let showModal = false;
	export let inputArray = ['CSE01', 'a1', 3, '2022-01-01'];
	export let change = false;
	export let user;
	let students = [];
	let confirmationMessage = [];
	let attendance = [];
	let rollNumbersInput = '';
	let selectedStatus = 'present';
	let batchName = inputArray[1];
  let subject = inputArray[0];
  let hour = inputArray[2];
  let date = inputArray[3];
  let recordOfClassWork= [];
	$: console.log(students, attendance);
  $: subject = inputArray[0];
  $: batchName = inputArray[1];
  $: hour = inputArray[2];
  $: date = inputArray[3];
  $: if (change){
	getpreviousAttendance(subject,hour,batchName,date,students[0].department).then((e) => {
		const result = JSON.parse(JSON.parse(e.data)[1]);
		const sorted = result.sort(dynamicSort("student_id"))
		console.log("sorted",sorted)
		sorted.forEach((value,index)=>{
			attendance[index] = value.status
		})
		console.log("previous attendence",attendance)
		change=false;
  });
  }
  let selectedTopic = '';
  $: getLessonPlan(subject,hour).then((e) => {
	recordOfClassWork = JSON.parse(JSON.parse(e.data)[1]);
  });
  
	$: students = Array(
		getInitialTotalStudents(inputArray[1]).then((e) => {
			return e;
		})
	).fill('present');
	$: attendance = Array(students.length).fill('present');
	const getLessonPlan = async(subject) =>{
		try {
			const formData = new FormData();
			formData.append('batchName', batchName);
			formData.append('subject', subject);
			formData.append('hour', hour);
			const response = await fetch('/attendence?/getLessonPlan', {
				method: 'POST',
				body: formData
			});
			if (!response.ok) {
				throw new Error(`Failed to fetch lesson plan: ${response.statusText}`);
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching lesson plan:', error);
			return 'No lesson plan available';
		}
	}
	const getpreviousAttendance = async(subject,hour,batchName,date,dept) =>{
		try {
			const formData = new FormData();
			formData.append('batchName', batchName);
			formData.append('subject', subject);
			formData.append('hour', hour);
			formData.append('date', date);
			formData.append('dept', dept);
			const response = await fetch('/attendence?/getpreviousAttendance', {
				method: 'POST',
				body: formData
			});
			if (!response.ok) {
				throw new Error(`Failed to fetch previous attendance: ${response.statusText}`);
			}
			const data = await response.json();
			console.log(data);
			return data;
		} catch (error) {
			console.error('Error fetching previous attendance:', error);
			return 'No previous attendance available';
		}
	}
	async function getInitialTotalStudents(batchName) {
		try {
			const formData = new FormData();
			formData.append('batchName', batchName);

			const response = await fetch('/attendence?/getStudents', {
				method: 'POST',
				body: formData
			});

			// Check for successful response
			if (!response.ok) {
				throw new Error(`Failed to fetch student count: ${response.statusText}`);
			}

			const data = await response.json();

			// Assuming data structure (details hidden):
			// return JSON.parse(JSON.parse(data.data)[1]).length;

			// Optimized parsing (assuming data structure)
			students = await JSON.parse(await JSON.parse(data.data)[1]);
			const studentCount = parseInt(students.length);
			return studentCount;
		} catch (error) {
			console.error('Error fetching student count:', error);
			// Handle error gracefully (e.g., return a default value)
			return 60; // Fallback value if fetching fails
		}
	}
  function getInitials(name) {
  // Split the name into an array of words
  const words = name.trim().split(' ');

  // Initialize an empty string to store initials
  let initials = '';

  // Loop through each word in the name
  for (const word of words) {
    // Get the first letter of the current word and convert it to uppercase
    initials += word[0].toUpperCase();
  }

  // Return the concatenated initials
  return initials;
}
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
  const save = () => {
    let attendanceData = []
    students.forEach((student,index) => {
      let data = {
        id: student.id,
        name: student.name,
        subject: subject,
        period: hour,
        batch: batchName,
        date: date,
        status: attendance[index],
		topic: selectedTopic,
		dept: students[0].department,
		facultyid: user.id
      }
      attendanceData.push(data);
    });
    console.log(attendanceData);
    const formData = new FormData();
    formData.append('attendanceData', JSON.stringify(attendanceData));
    fetch('/attendence?/save', {
      method: 'POST',
      body: formData
    }).then((res) => {
      if (res.ok) {
        console.log('Data saved successfully');
        showModal = false;
      } else {
        console.error('Failed to save data:', res.statusText);
      }
    });
  }
	onMount(async () => {
		console.log('Fetching initial student count...', getInitialTotalStudents(inputArray[1]));
		getInitialTotalStudents(inputArray[1]).then((totalStudents) => {;
			attendance = Array.from({ length: totalStudents }, () => 'present');
		});
		students = [...students];
		console.log(students);
		
	});

	const handleStudentClick = (index) => {
		// students = [...students]; // Create a copy
		// const statusMapping = { present: "absent", absent: "onDuty", onDuty: "present" };
		// students[index] = statusMapping[students[index]];
		const statusMapping = { present: 'absent', absent: 'onDuty', onDuty: 'present' };
		const newStatus = statusMapping[attendance[index]];
		attendance = [...attendance.slice(0, index), newStatus, ...attendance.slice(index + 1)];
	};

	const handleRollNumbersChange = (event) => {
		rollNumbersInput = event.target.value;
	};

	const handleStatusChange = (event) => {
		selectedStatus = event.target.value;
	};

	const applyStatusToSelectedRollNumbers = () => {
		// const rollNumbersArray = rollNumbersInput
		//   .split(",")
		//   .map((number) => parseInt(number.trim(), 10));

		// students = students.map((status, index) => {
		//   const shouldUpdate = rollNumbersArray.includes(index + 1);
		//   return shouldUpdate ? selectedStatus : status;
		// });

		// rollNumbersInput = "";
		const rollNumbersArray = rollNumbersInput
			.split(',')
			.map((number) => parseInt(number.trim(), 10));

		attendance = attendance.map((status, index) => {
			return rollNumbersArray.includes(index + 1) ? selectedStatus : status;
		});

		rollNumbersInput = '';
	};

	const getStatusColorClass = (status) => {
		switch (status) {
			case 'present':
				return 'present';
			case 'absent':
				return 'absent';
			case 'onDuty':
				return 'onDuty';
			default:
				return '';
		}
	};
</script>

<svelte:head>
	<link href="./styles/header.css" />
</svelte:head>

{#if students}
	<div class="classroom-grid">
		<!-- {[...Array(Math.ceil(students.length / 3))].map((_, benchIndex) => ( -->
		{#each [...Array(Math.ceil(students.length / 3))] as key, benchIndex}
			<div key={benchIndex} class="bench">
				<!-- {[...Array(3)].map((_, studentIndex) => { -->
				{#each [...Array(3)] as key2, studentIndex}
					{#if students}
						{#if students[benchIndex * 3 + studentIndex]}
							<div
								key={benchIndex * 3 + studentIndex}
								class={`student-box ${getStatusColorClass(attendance[benchIndex * 3 + studentIndex])}`}
								on:click={() => handleStudentClick(benchIndex * 3 + studentIndex)}
							>
								{students[benchIndex*3+studentIndex].name} {benchIndex * 3 + studentIndex + 1} 
							</div>
						{/if}
					{/if}
				{/each}
			</div>
		{/each}
	</div>
  <Modal bind:showModal>
    <h2 slot="header">
      Attendence List
    </h2>
    <table class="table table-bordered table-hover table-striped">
      <thead>
        <tr>
          <th>id</th>
          <th>Name</th>
          <th>subject</th>
          <th>Period</th>
          <th>Batch</th>
          <th>Status</th>
        </tr>
      </thead>
      {#each students as student, index}
          <tbody>
            <tr>
              <th>{student.id}</th>
              <th>{student.name}</th>
              <th>{subject}</th>
              <th>{hour}</th>
              <th>{batchName}</th>
              <th class={attendance[index]}>{attendance[index]}</th>
            </tr>
          </tbody>
      {/each}
    </table>
    <button on:click={save}>Save</button>
    <select name="recordOfClassWork" id="recordOfClassWork" bind:value={selectedTopic}>
      {#each recordOfClassWork as record}
		<option value={record[2]}>{record[2]}</option>
	  {/each}
    </select>
  
  </Modal>
  


	<div class="controls">
		<select value={selectedStatus} on:change={handleStatusChange}>
			<option value="present">Present</option>
			<option value="absent">Absent</option>
			<option value="onDuty">On Duty</option>
		</select>
		<input
			type="text"
			placeholder="Enter roll numbers (e.g., 1, 3, 5)"
			value={rollNumbersInput}
			on:input={handleRollNumbersChange}
		/>
		<button on:click={applyStatusToSelectedRollNumbers}>Update</button>
		<button on:click={() => (attendance = Array(students.length).fill('present'))}>Reset</button>
		<button on:click={() => (attendance = Array(students.length).fill('absent'))}>Absent All</button
		>
		<button on:click={() => (showModal = true)}>Save</button>
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300&display=swap');
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* width:80vw; */
	}
	.grid-container {
		display: grid;
		user-select: none;
		grid-template-columns: 250px 1fr; /* grid-cols-[250px_1fr] equivalent */
		gap: 4px; /* gap-4 equivalent */
	}
	.overflow-container {
		padding: 1rem; /* p-4 equivalent */
		border-right: 1px solid lightgrey; /* border-r equivalent */
		overflow-y: auto; /* overflow-auto equivalent */
	}
	.active {
		box-shadow: 0 0 9px 0px rgba(66, 153, 225, 0.5);
		transition: all 0.2s ease;
	}
	.inner {
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-items: center;
	}
	#userimg img {
		border-radius: 130px;
		border: 1px solid darkgrey;
	}
	.rotobo-text {
		font-family: 'Roboto', sans-serif;
	}
	.DateBox {
		display: flex;
		margin: 10px 0;
		overflow-x: scroll;
		max-width: 80vw;
		gap: 5px;
		padding: 5px;
		/* box-shadow: 0px 1px 2px 0px #0000002b; */
		border-radius: 6px;
		background-image: linear-gradient(267deg, #4c11c01a, transparent);
	}
	.Box {
		grid-column: span 1;
		background-color: white;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		border-radius: 5px;
		box-shadow: 0px 7px 10px -3px rgba(0, 0, 0, 0.1);
	}
	.activeBox,
	.activeBox .day {
		background-color: #adb1ff;
		color: #f8f5f5;
	}
	.day {
		font-size: x-small;
		color: rgb(129, 125, 125);
		font-family: roboto;
		pointer-events: none;
	}
	.Box:hover .day {
		color: #f8f5f5;
	}
	.Box:hover {
		background-color: #adb1ff;
		color: #f8f5f5;
	}
	.daynum {
		font-size: large;
		font-family: roboto;
		font-style: italic;
		pointer-events: none;
	}
	.activeStatus {
		font-family: roboto;
		color: darkgrey;
		font-size: x-small;
		display: flex;
	}
	.col-span-1 {
		grid-column: span 1;
	}
	.grid {
		display: grid;
	}
	.grid-cols-7 {
		grid-template-columns: repeat(7, minmax(0, 1fr));
	}
	.gap-2 {
		gap: 0.5rem;
	}
	.classroom-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 5px;
		width: 80vw;
	}

	.bench {
		display: flex;
		gap: 7px;
		flex-wrap: nowrap;
		align-content: space-between;
		justify-content: center;
	}

	.student-box {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		background-color: #808080; /* Grey box for all students */
		color: #fff;
		cursor: pointer;
		font-family: roboto;
		font-size: x-small;
		border-radius: 5px;
		box-shadow: 0px 7px 10px -3px rgba(0, 0, 0, 0.1);
		text-shadow: 0px 0px 3px #00000094;
	}

	.present {
		background-color: #00cc00; /* Green box for present students */
	}

	.absent {
		background-color: #e40a14; /* Red box for absent students */
	}

	.onDuty {
		background-color: #74a3ff; /* Blue box for students on duty */
	}
	.controls {
		font-family: roboto;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20px 0;
		width: 80vw;
	}
	.controls select {
		height: 30px;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		background-color: #adb1ff;
		color: #f8f5f5;
		outline: none;
	}
	.controls input {
		height: 30px;
		width: 150px;
		outline: none;
		font-size: small;
	}
	.controls input::placeholder {
		font-size: x-small;
		text-align: center;
	}
	.controls button {
		height: 30px;
		border-radius: 0px;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		background-color: #adb1ff;
		color: #f8f5f5;
		line-height: 0;
		outline: none;
	}
	.control {
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: space-evenly;
		padding: 8px 0;
	}
	.present-color {
		color: green; /* or your preferred color for present status */
	}

	.absent-color {
		color: red; /* or your preferred color for absent status */
	}

	.onDuty-color {
		color: blue;
	}
	.TBox {
		min-height: 65px;
	}
	.TBox:hover {
		transition: transform ease-in-out 100ms;
		box-shadow: 0px 0px 15px 6px #adb1ff;
		border: none;
		transform: scale3d(1.2, 1.2, 1.2);
	}
	.tablecontent {
		width: 80vw;
		font-family: roboto;
		text-align: center;
	}
	.free-hour {
		background-color: #e0ffe0;
	}
	.module-color {
		background-color: rgba(0, 128, 128, 0.541);
	}
	.moduleName-color {
		background-color: rgba(0, 128, 0, 0.555);
	}
	.topicName-color {
		background-color: rgba(0, 0, 255, 0.466);
	}
	.duration-color {
		background-color: rgba(255, 0, 0, 0.534);
	}
	.subject0 {
		background-color: hsl(0, 80%, 80%);
	}
	.subject1 {
		background-color: hsl(40, 80%, 80%);
	}
	.subject2 {
		background-color: hsl(80, 80%, 80%);
	}
	.subject3 {
		background-color: hsl(120, 80%, 80%);
	}
	.subject4 {
		background-color: hsl(160, 80%, 80%);
	}
	.subject5 {
		background-color: hsl(200, 80%, 80%);
	}
	.subject6 {
		background-color: hsl(240, 80%, 80%);
	}
	/* .mb-4{
    width: 80vw;
  } */
	@media (min-width: 568px) {
		.classroom-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
