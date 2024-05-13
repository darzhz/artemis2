<script>
	import TimeAdapt from '../../../../../../components/TimeAdapt.svelte';

    export let data;
    let students = data.db.students;
    let subjects = data.db.subjects;
    let faculty = data.db.faculty;
    let facultyAssignment = data.db.facultyAssigned;
    let facultyInCharge = data.db.facultyInCharge;
    let sem = data.thisPage.sem;
    let dept = data.thisPage.dept;
    let batch_id = data.thisPage.batch_id;
    let Timetable = data.db.timetable[0];
    console.log(Timetable);
    let initialArray = Timetable ? JSON.parse(Timetable.timetable) : [
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
];    
    console.log(subjects);
    let selectedOption = "info";
    function handleOptionChange(event) {
    selectedOption = event.target.value;
  }
  let facultyAssignmentData = {};
  const assignSubjects = () => {
    console.log("Assigning Subjects");
    console.log(facultyAssignmentData);
    //create the payload
    let payload = {}
    Object.keys(facultyAssignmentData).forEach((value,index) => {
        payload[index] = {faculty_id: facultyAssignmentData[Object.keys(facultyAssignmentData)[index]],subject_id: value,sem: sem,dept: dept,batch_id: batch_id};
    });
    //send the payload to the server
    fetch(`/semester/${dept}/${sem}/batch/${batch_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => res.json()).then(data => {
        console.log(data);
    });
    
  };
  const arrayToObject = arr => {
   const res = {};
   for(let i = 0; i < arr.length; i++){
      const key = arr[i]['id'];
      res[key] = arr[i];
      delete res[key]['id'];
   };
   return res;
};
console.log(subjects,arrayToObject(subjects));
  
</script>
<div>
    <div class="container">
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-secondary primary">
              <input type="radio" name="options" value="info" bind:group={selectedOption} autocomplete="off" checked> info
            </label>
            <label class="btn btn-secondary primary">
              <input type="radio" name="options" value="Faculty" bind:group={selectedOption} autocomplete="off"> Faculty
            </label>
            <label class="btn btn-secondary primary">
              <input type="radio" name="options" value="Timetable" bind:group={selectedOption} autocomplete="off"> Timetable
            </label>
          </div>
          
          {#if selectedOption === "info"}
          <div class="row">
            <div class="col-12">
                <h1 class="text-center">Students</h1>
            </div>
        </div>
        <div class="row">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Batch</th>
                        <th scope="col" colspan="3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each students as student}
                            <tr>
                                <th scope="row">{student.id}</th>
                                <td>{student.name}</td>
                                <td>{student.batch ? student.batch : '-'}</td>
                                <td colspan="3">
                                    <button class="btn btn-primary btn-sm">View</button>
                                    <button class="btn btn-danger btn-sm">edit</button>
                                    <button class="btn btn-warning btn-sm">delete</button>
                                    <button class="btn btn-success btn-sm">report</button>
                                </td>
                            </tr>
                    {/each}
                </tbody>
            </table>
            <div class="col-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title text-center">Add New Student</h5>
                        <p class="card-text text-center">
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <hr/>
        {/if}
        {#if selectedOption === "Faculty"}
        <div class="row">
            <div class="col-12">
                <h1 class="text-center">Assign Faculty</h1>
            </div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Subject</th>
                        <th scope="col">Faculty</th>
                    </tr>
                </thead>
                <tbody>
                    {#each subjects as subject}
                    <tr>
                        <td>{subject.name}</td>
                        <td>
                            <select class="form-control" bind:value={facultyAssignmentData[subject.code]}>
                                {#each faculty as f}
                                <option value={f.id}>{f.name}</option>
                                {/each}
                            </select>
                        </td>
                    </tr>
                    {/each}
                    <button type="submit" class="btn btn-primary" on:click={()=>{assignSubjects()}}>Assign</button>
                    <button type="reset" class="btn btn-danger">Reset</button>
                </tbody>
            </table>
            <hr/>
            <h1>Faculty Assignment</h1>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Subject</th>
                        <th scope="col">Faculty</th>
                    </tr>
                </thead>
                <tbody>
                    {#each facultyAssignment as fa}
                    <tr>
                        <td>{fa.subject_id}</td>
                        <td>{fa.faculty_id}</td>
                    </tr>
                    {/each}
                </tbody>
        </div>
        {/if}
        {#if selectedOption === "Timetable"}
        <div class="row">
            <TimeAdapt subject={[subjects]} sem={sem} dept={dept} batch={batch_id} faculty={facultyInCharge} initialArray={initialArray}/>
        </div>
        {/if}
    </div>
</div>
<style>
    .container {
        margin-top: 20px;
    }
    .btn-group{
        width: 422px;
    }
    .primary{
        background-color: #007bff;
        border: none;
    }
</style>