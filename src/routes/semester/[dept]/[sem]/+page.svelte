<script>
	import { get } from 'svelte/store';
	//we need to list batches as a group of cards and a big card which is essentially a button to add a new batch
	//data of all available batches/classes
	import Popup from '../../../../components/Popup.svelte';
	export let data;
	let dept = data.thisPage.dept;
	let sem = data.thisPage.sem;
	let allSubjects = data.db.subjects;
	let batches = data.db.batches;
	const returnSubjectInfoByCode = (code) => {
		for (let subject in allSubjects) {
			if (allSubjects[subject].code === code) {
				return allSubjects[subject];
			}
		}
	};
	let subjectBasketFromDatabase = data.db.basket[0];
	let subjectBasket = {};
	console.log(subjectBasketFromDatabase);
	//convert subjectBasket.subjects which is a string to an array the subjectBasket is from the database so it takes time to load
	if (subjectBasketFromDatabase && typeof subjectBasketFromDatabase.subjects === 'string') {
		subjectBasketFromDatabase.subjects = subjectBasketFromDatabase.subjects.split(',');
		subjectBasketFromDatabase.subjects.forEach((subject, index) => {
		console.log(subject,Object.keys(subjectBasketFromDatabase).length,index);
		//subjectBasketFromDatabase[Object.keys(subjectBasketFromDatabase).length] = returnSubjectInfoByCode(subject);
		const sub = returnSubjectInfoByCode(subject);
		subjectBasket[sub.id] = sub;
	});
	}
	
	console.log(subjectBasket);
	let showPopup = false;
	const openModel = () => {
		showPopup = true;
	};
	const addToBasket = (subject) => {
		subjectBasket[subject] = allSubjects[subject];
		console.log(subjectBasket);
	};
	const removeFromBasket = (subject) => {
		delete subjectBasket[subject];
		subjectBasket = {...subjectBasket};
	};
	const updateBasket = () => {
		//update the basket in the database by doing a post request
		const payload = {
			subject: returnCodeArray(),
			dept: data.thisPage.dept,
			sem: data.thisPage.sem,
		};
		fetch(`/semester/${data.thisPage.dept}/${data.thisPage.sem}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		}).then(res => res.json()).then(data => {
			console.log(data);
		});
	};
	const returnCodeArray = () => {
		let codes = [];
		for (let sub in subjectBasket) {
			codes.push(subjectBasket[sub].code);
		}
		return codes;
	};
	//get the ids of the subjects in the basket
	const getSubjectIds = () => {
		let ids = [];
		for (let sub in subjectBasket) {
			ids.push(subjectBasket[sub].id);
		}
		return ids;
	};
	console.log(getSubjectIds());
</script>

<!-- //A svelte page for showing the details of a semester and the user can edit the semester details add
courses to the semester and view the courses in the semester,add students to the semester and view
the students in the semester,view batches in the semester and add batches to the semester and add
students to batches //use bootstrap to style the page //additionally we can add subjects for a
semester and add faculty for the subjects -->
<div>
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h1 class="text-center">Batches</h1>
			</div>
		</div>
		<div class="row">
			{#each Object.keys(batches) as batch}
				<div class="col-3">
					<div class="card">
						<div class="card-body">
							<h5 class="card-title text-center">{batches[batch].name}</h5>
							<p class="card-text text-center">Department: {batches[batch].department}</p>
							<p class="card-text text-center">No of Students: {batches[batch].noOfStudents}</p>
							<p class="card-text text-center">
								<a href="/semester/{dept}/{sem}/batch/{batches[batch].name}" class="btn btn-primary">View</a>
							</p>
						</div>
					</div>
				</div>
			{/each}
			<div class="col-3">
				<div class="card">
					<div class="card-body">
						<h5 class="card-title text-center">Add New Batch</h5>
						<p class="card-text text-center">
							<a href="/semester/{dept}/{sem}/add" class="btn btn-primary">Add</a>
						</p>
					</div>
				</div>
			</div>
		</div>
		<hr />
		<div class="row">
			<h1 class="text-center">Subject Basket</h1>

			<div class="col-12 basket">
				<!-- list subject code in subject basket in the form of colored tags with a tiny x button to remove it -->
				{#if Object.keys(subjectBasket).length > 0}
					{#each Object.keys(subjectBasket) as subject}
							<span on:click={()=>{removeFromBasket(subject)}} class="badge badge-primary">{subjectBasket[subject].code} x</span>
					{/each}
				{:else}
						<p class="text-center">No Subjects Added</p>
				{/if}
			</div>
		<!-- mechanism to add subjects to this semester styled with bootstrap -->
		<div class="row">
			<div class="col-12">
				<h1 class="text-center">All Subjects</h1>
			</div>
			<div style="max-height: 200px;overflow-y:auto;">
			<table class="table table-striped">
				<thead>
					<tr>
						<th scope="col">ID</th>
						<th scope="col">Name</th>
						<th scope="col">Department</th>
						<th scope="col">code</th>
						<th scope="col">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each Object.keys(allSubjects) as subject}
						<tr>
							<th scope="row">{allSubjects[subject].id}</th>
							<td>{allSubjects[subject].name}</td>
							<td>{allSubjects[subject].department}</td>
							<td>{allSubjects[subject].code}</td>
							<td>
								<!-- only show add button is subject is not in subjectBasket -->
								<!-- {#if !getSubjectIds().includes(parseInt(subject))} -->
								{#if !subjectBasket[subject]}
									<button class="btn btn-primary" on:click={() => addToBasket(subject)}>Add</button>
								{:else}
									<button class="btn btn-primary" disabled>Added</button>
								{/if}
								
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			</div>
			<div class="controls">
				<button class="btn btn-primary" on:click={()=>{updateBasket()}}>Update Basket</button>
				<button class="btn btn-danger">Reset Basket</button>
			</div>
			</div>
			</div>


	</div>
</div>
<style>
	.card {
		margin: 10px;
	}
	.card-body {
		padding: 10px;
	}
	.card-title {
		font-size: 20px;
	}
	.card-text {
		font-size: 16px;
	}
	.btn {
		width: 100%;
	}
	.badge {
		margin: 5px;
		cursor: pointer;
	}
	.table {
		margin-top: 20px;
	}
	.badge-primary {
		background-color: #007bff;
	}
	.basket {
		margin-top: 20px;
		background-color: #f0f0f0;
		border-radius: 20px;
	}
	.controls {
		margin-top: 20px;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-content: center;
		justify-content: space-between;
	}

</style>