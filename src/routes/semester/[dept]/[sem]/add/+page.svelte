<script>
    //a page to add a new batch to a semester and add available students to the batch
    //can set a batch name and add students to the batch, use boostrap to style the page
    export let data;
    const dept = data.thisPage.dept;
    const sem = data.thisPage.sem;
    let studentsInBatch = [];
    let showPopup = false;
    let SelectedYear = '';
    let facultyInCharge = '';
    const openModel = () => {
        showPopup = true;
    }
    
    const allStudents = data.db.students;
    console.log(allStudents);

    let batchName = 'Untitled';
    // let subjectsInSem = ['Subject 1','Subject 2','Subject 3','Subject 4','Subject 5'];
    let subjectsInSemString = data.db.subjectsInSem[0];
    let subjectsInSem = [];
    if(subjectsInSemString && typeof subjectsInSemString.subjects === 'string'){
        subjectsInSem = subjectsInSemString.subjects.split(',');
    }
    let allotedList = [];

    const addStudent = (student) => {
        studentsInBatch.push(student);
        //remove the student from the filtered available students list
        filterdAllStudents = filterdAllStudents.filter(item => item.id !== student.id);
        filterdAllStudents = [...filterdAllStudents];
        studentsInBatch = [...studentsInBatch];
        console.log(studentsInBatch);
    }

    const removeStudent = (studentId) => {
        studentsInBatch = studentsInBatch.filter(student => student.id !== studentId);
        //add the student back to the filtered available students list only the students who are not in any batch
        const removedStudent = allStudents.find(student => student.id === studentId);
        filterdAllStudents.push(removedStudent);
        //sort based on id
        filterdAllStudents = filterdAllStudents.sort((a,b) => a.id - b.id);
        filterdAllStudents = [...filterdAllStudents];
    }
    let filterdAllStudents = allStudents;
    let searchTerm = '';
    const filter = () => {
        filterdAllStudents = allStudents.filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()));
        filterdAllStudents = [...filterdAllStudents];
    }
    const handleCheck = (subject) => {
        if(allotedList.includes(subject)){
            allotedList = allotedList.filter(item => item !== subject);
        }else{
            allotedList.push(subject);
        }
        allotedList = [...allotedList];
    }
    const createBatch = () => {
        //create a new batch with the name and the students in the batch
        console.log(batchName,studentsInBatch,allotedList,SelectedYear);
        const payload = {
            name: batchName,
            students: studentsInBatch,
            subjects: allotedList,
            year: SelectedYear,
            facultyIncharge: facultyList[facultyInCharge].name,
            dept: dept,
            sem: sem
        }
        console.log(payload);
        //send the payload to the server to create a new batch
        fetch(`/semester/${dept}/${sem}/add`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(res => res.json()).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
    }
    // const facultyList = ['Faculty 1','Faculty 2','Faculty 3','Faculty 4','Faculty 5'];
    const facultyList = data.db.faculty;
    console.log(facultyList);
</script>

<div class="container">
    <h1 class="text-center">Add Batch {batchName}</h1>
    <p>Total Students in Batch: {studentsInBatch.length}</p>
    <div class="mb-3">
        <label for="batch-name">Enter Batch Name:</label>
        <input type="text" name="batch-name" bind:value={batchName} placeholder="Enter Batch Name" />
        <!-- select faculty in charge from a list of faculty -->
        <label for="faculty">Select Faculty In Charge:</label>
        <select name="faculty" id="faculty" bind:value={facultyInCharge}>
            {#each facultyList as faculty}
                <option value={faculty.id}>{faculty.name}</option>
            {/each}
        </select>
        <!-- year selector as in date year 2020,2021,2022 upto current date backwords only till 8 years dynamically using a date selector etc -->
        <label for="year">Select Year:</label>
        <select name="year" id="year" bind:value={SelectedYear}>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
        </select>
    </div>

    <div class="filter" style="height: 500px;overflow:scroll;">
        <label for="filter">Filter Students</label>
        <input type="text" name="filter" bind:value={searchTerm} on:change={()=>{filter()}} placeholder="Filter Students" />
        <button class="btn btn-danger btn-sm">Clear</button>
        <h4>Available Students ({filterdAllStudents.length})</h4> 
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Batch</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {#each filterdAllStudents as student}
                    {#if student.batch === null}
                        <tr>
                            <th scope="row">{student.id}</th>
                            <td>{student.name}</td>
                            <td>{student.batch ? student.batch : '-'}</td>
                            <td>
                                <button class="btn btn-primary btn-sm" on:click={() => addStudent(student)}>Add</button>
                            </td>
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
    </div>

    <div class="selected-students mt-3">
        <h4>Selected Students ({studentsInBatch.length})</h4>
        <ul style="
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: center;
        align-items: stretch;">
            {#each studentsInBatch as student}
                <li>
                    {student.name}
                    <button class="btn btn-danger btn-sm float-end" on:click={() => removeStudent(student.id)}>Remove</button>
                </li>
            {/each}
        </ul>
    </div>
    <hr>
    <!-- functionality to add subjects to batch based on subjects in sem -->
    <button class="btn btn-primary" on:click={openModel}>Add Subjects</button>
    <!-- display the list of alloted subjects -->
    <div class="sublist">
        <h4>Subjects Alloted</h4>
    <ul>
        {#each allotedList as subject}
            <span class="badge badge-primary">{subject}</span>
        {/each}
    </ul>
    </div>
    <button class="btn btn-primary mb-3" on:click={()=>{createBatch()}} disabled={!batchName || studentsInBatch.length === 0}>Create Batch</button>
    {#if showPopup}
        <div class="modal" tabindex="-1" style="display:block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add Subjects</h5>
                        <button type="button" class="btn-close" on:click={()=>showPopup = false}></button>
                        
                    </div>
                    <div class="modal-body text-center">
                        <p>Subjects in Semester</p>
                        <ul>
                            <!-- add a check box for each list and the checked item to allotedList -->
                            {#each subjectsInSem as subject}
                                <div class="form-check">
                                <label for={subject}>{subject}</label>
                                {#if allotedList.includes(subject)}
                                    <input type="checkbox" name="subject" id={subject} value={subject} checked on:change={()=>handleCheck(subject)} />
                                {:else}
                                    <input type="checkbox" name="subject" id={subject} value={subject} on:change={()=>handleCheck(subject)} />
                                {/if}
                                </div>
                            {/each}
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" on:click={()=>showPopup = false}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}    
</div>
<style>
    .filter {
        border: 1px solid #ccc;
        padding: 10px;
    }
    .selected-students {
  border: 1px solid #ddd;
  padding: 10px;
  max-height: 300px;
  overflow-y: scroll;
}

.selected-students ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.selected-students li {
    margin: 0.7rem;
}
.sublist {
    border: 1px solid #ddd;
    padding: 10px;
    max-height: 300px;
    overflow-y: scroll;
}
.badge {
		margin: 5px;
		cursor: pointer;
	}
    .badge:hover {
        background-color: #ccc;
    }
    .badge-primary {
        background-color: #007bff;
    }
</style>