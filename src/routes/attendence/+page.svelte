<script>
	import { user } from '../../stores/auth';
	// import AttendenceAdapter from '../../components/AttendenceAdapter.svelte';
	import Classroomgrid from '../../components/Classroomgrid.svelte';
	import { onMount } from 'svelte';
	let timeData;
	let mtwtfss = new Date().toLocaleDateString('en-GB');
	let active = new Date().toLocaleDateString('en-GB');
  let change = false;
	let activeHour = '';
	let inputArray = [];
	// $: console.log(active);
  // $: console.log(inputArray);
	let day = getPast30Days();
	let daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  let hourbasket = [];
  $: console.log(hourbasket);
	function getPast30Days() {
		const today = new Date();
		const past30Days = [];
		for (let i = 0; i < 30; i++) {
			const pastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
			past30Days.push(pastDay);
		}
		return past30Days;
	}
  function removeDuplicates(arr, prop) {
    return arr.filter((obj, index, self) =>
        index === self.findIndex(o => o[prop] === obj[prop])
    );
}
	function handleDateChange(e) {
		let selectedDay = e.target.getAttribute('time');
		const formattedDate = new Date(selectedDay);
		active = formattedDate.toLocaleDateString('en-GB');
		console.log(selectedDay);
		mtwtfss = selectedDay;
		hourbasket = hoursOfAllSubjects();
	}
	function handleHourChange(e) {
		let selectedHour = e.target.getAttribute('hour');
		activeHour = selectedHour;
		inputArray = selectedHour.split(',');
		inputArray = [...inputArray];
		console.log(selectedHour);
    change = true;
	}

	onMount(async () => {
		const data = new FormData();
		data.append('userId', $user.id);
		const res = await fetch('/attendence?/getTimeTable', {
			method: 'POST',
			body: data
		});
		const resp = await res.json();
		timeData = JSON.parse(JSON.parse(resp.data)[1]);
		console.log(timeData);
	});

	export let data;

	function getAllIndexes(arr, val) {
		const indexes = [];
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === val) {
				indexes.push(i);
			}
		}
		return indexes;
	}

	const findHours = (timetable, day, subject) => {
		const time = JSON.parse(timetable.timetable);
		const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
		const timeArray = time[daysOfWeek.indexOf(day)];
		return getAllIndexes(timeArray, subject);
	};
	function hoursOfAllSubjects() {
		const allHours = [];
		timeData.forEach((timetable) => {
			const subjects = timetable.subjects.split(',');
			subjects.forEach((subject) => {
				const day = new Date(mtwtfss).getDay(); // Get current day of the week
				const dayOfWeek = [
					'sunday',
					'monday',
					'tuesday',
					'wednesday',
					'thursday',
					'friday',
					'saturday'
				][day];
				const hours = findHours(timetable, dayOfWeek, subject);
				if (hours.length) {
					allHours.push({
						batchId: timetable.batch_id, // Include batch ID in the result
						subject,
						hours: hours, // Array of indexes representing subject hours
						dayOfWeek // Include the day of the week for clarity
					});
				}
			});
		});

		console.log(allHours); // Log the complete list of hours for all subjects
		return allHours; // Optionally return the allHours array for further processing
	}
</script>

<p>Welcome Back {$user.name}</p>

<div class="DateBox">
	{#each day as keyname, key}
		<div
			class={`Box ${keyname.toLocaleDateString('en-GB') === active ? 'activeBox' : ''}`}
			on:click={(event) => handleDateChange(event)}
			id={key}
			time={keyname}
		>
			<span class="day">{daysOfWeek[keyname.getDay()]}</span>
			<span class="daynum">{keyname.getDate()}</span>
		</div>
	{/each}
</div>
<p>selected day is {daysOfWeek[new Date(mtwtfss).getDay()]} and hour is {activeHour}</p>
<div class="DateBox">
    {#if hourbasket.length > 0}
        {#each removeDuplicates(hourbasket,'subject') as hour}
            {#each hour.hours as hourIndex}
                <div class={`Box text-centered ${[hour.subject,hour.batchId,hourIndex+1,mtwtfss] == activeHour? 'activeBox' : 'S'}`} on:click={(event) => handleHourChange(event)} hour={`${[hour.subject,hour.batchId,hourIndex+1,mtwtfss]}`}>
                    <span class="day">{hour.subject}</span>
                    <span class="daynum text-xs">{hour.batchId}</span>
                    <span class="day">Period {hourIndex+1}</span>
                </div>
            {/each}
        {/each}
    {:else}
        <p>No data available</p>
    {/if}
</div>

{#if inputArray.length > 0}
  <Classroomgrid inputArray={inputArray} user={$user} bind:change={change}/>
  {:else}
   <p>No data available</p>
{/if}
<!-- <AttendenceAdapter inputArray={inputArray}/> -->
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
  padding: 1rem;  /* p-4 equivalent */
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
#userimg img{
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
    box-shadow: 0px 7px 10px -3px rgba(0,0,0,0.1);
}
.activeBox,.activeBox .day {
    background-color: #adb1ff;
    color: #F8F5F5;
}
.day {
    font-size: x-small;
    color: rgb(129, 125, 125);
    font-family: roboto;
    pointer-events: none;
}
.Box:hover .day {
    color: #F8F5F5;
}
.Box:hover{
    background-color: #adb1ff;
    color: #F8F5F5;
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
.col-span-1{
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
    box-shadow: 0px 7px 10px -3px rgba(0,0,0,0.1);
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
    color: #F8F5F5;
    outline: none;
  }
  .controls input {
    height: 30px;
    width:150px;
    outline: none;
    font-size: small;
  }
  .controls input::placeholder{
    font-size: x-small;
    text-align: center;
  }
  .controls button{
    height: 30px;
    border-radius: 0px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #adb1ff;
    color: #F8F5F5;
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
  .TBox:hover{
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
  .subject0 { background-color: hsl(0, 80%, 80%); }
    .subject1 { background-color: hsl(40, 80%, 80%); }
    .subject2 { background-color: hsl(80, 80%, 80%); }
    .subject3 { background-color: hsl(120, 80%, 80%); }
    .subject4 { background-color: hsl(160, 80%, 80%); }
    .subject5 { background-color: hsl(200, 80%, 80%); }
    .subject6 { background-color: hsl(240, 80%, 80%); }
  /* .mb-4{
    width: 80vw;
  } */
  @media (min-width: 568px) {
    .classroom-grid {
        grid-template-columns: repeat(3,1fr);
    }
  }
</style>
