<script>
    export let form;
    export let data;
    import Popup from '../../components/Popup.svelte';
    import { goto } from '$app/navigation';
    let showPopup = false;
    if (form && form.status == 200) {
        showPopup = true;
    }
    let department = "";
    let semester = "";
    let batches = [];
    let allExams = data.db.allExams;
    let gradedExams = data.db.gradedExams;
    console.log(allExams);
    const fetchBatches = async () => {
        const formData = new FormData();
        formData.append('department', department);
        formData.append('semester', semester);
        const res = await fetch(`/downloads?/getData`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        const batch = JSON.parse(data.data)[2];
        console.log(batch);
        batches = JSON.parse(batch);
    }
</script>
<svelte:head>
  <title>Exams</title>
</svelte:head>
{#if showPopup}
        <Popup on:close={()=>{showPopup=false}}>
            <p>{form.body.message}</p>
        </Popup>
{/if}
<div class="container-fluid">

    <!-- Page Heading -->
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800 text-primary">Exams</h1>
    </div>

    
    
    <div class="row">

        <div class="col-lg-5">

            <div class="card shadow mb-4">
                <div class="card-header py-3 bg-gradient-primary">
                    <h6 class="m-0 font-weight-bold white">Previous Exams</h6>
                </div>
                <div class="card-body">
                    <table class="table  table-striped " style="margin-bottom: 0;">
                        <thead>
                            <tr>
                                <th scope="col">Type</th>
                                <th scope="col">Date</th>
                                <th scope="col">Dept</th>
                                <th scope="col">Sem</th>
                                <th scope="col">Batch</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#if allExams.length == 0}
                                <tr>
                                    <td colspan="5" style="text-align: center;">No exams found</td>
                                </tr>
                            {/if}
                            {#each allExams as exam}
                                <tr class="tbl-row" on:click={()=>{goto(`/exams/${exam.exam_id}`)}}>
                                    <td>{exam.exam_type}</td>
                                    <td>{exam.exam_date}</td>
                                    <td>{exam.department}</td>
                                    <td>{exam.semester}</td>
                                    <td>{exam.batch}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                <center><p class="text-gray-500 col-lg-12">Click on any to view further details</p></center>

            </div>

        <div class="card shadow mb-4">
                <div class="card-header py-3 bg-gradient-primary">
                    <h6 class="m-0 font-weight-bold white">Grade Exams</h6>
                </div>
                <div class="card-body">
                    <table class="table" style="margin-bottom: 0;">
                        <thead>
                            <tr>
                                <th scope="col">Type</th>
                                <th scope="col" colspan="3">Progress</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#if gradedExams.length == 0}
                                <tr>
                                    <td colspan="5" style="text-align: center;">No exams found</td>
                                </tr>
                            {/if}
                            {#each gradedExams as exam}
                                <tr>
                                    <td>{exam.exam_type}</td>
                                    <td colspan="3">
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style="width: {(exam.graded/exam.total)*100}%" aria-valuenow={(exam.graded/exam.total)*100} aria-valuemin="0" aria-valuemax="100">{Math.round((exam.graded/exam.total)*100)}%</div>
                                        </div>
                                    </td>
                                    {#if exam.graded == exam.total}
                                        <td><a href={`/exams/${exam.exam_id}`}>View</a></td>
                                    {:else}
                                        <td><a href={`/exams/${exam.exam_id}`}>Grade</a></td>
                                    {/if}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div></div>

        <div class="col-lg-7">

            <!-- Dropdown Card Example -->
            

            <!-- Exam creation -->
            

            <div class="card shadow mb-4">
                <div class="card-header py-3 bg-gradient-primary">
                    <h6 class="m-0 font-weight-bold white">Add Exams</h6>
                </div>
                <div class="card-body">
                    <form action="/exams?/create" method="post">
                        <div class="form-group">
                            <label for="examType">Exam Type</label>
                            <select class="form-control" id="examType" name="examType" required>
                                <option value="">Select Exam Type</option>
                                <option value="GMT1">GMT 1</option>
                                <option value="GMT2">GMT 2</option>
                                <option value="GMT3">GMT 3</option>
                                <option value="ST1">SERIES TEST 1</option>
                                <option value="ST2">SERIES TEST 2</option>
                            </select>
                        </div>
                        <div class="row">
                        <div class="col-lg-4">
                        <div class="form-group">
                            <label for="maxMark">Max Mark</label>
                            <input type="number" class="form-control" id="maxMark" name="maxMark" placeholder="50" min="10" max="1000" required>
                        </div>
                        </div>
                        <div class="col-lg-4">
                        <div class="form-group">
                            <label for="minMark">Min Mark</label>
                            <input type="number" class="form-control" id="minMark" name="minMark" placeholder="24" min="10" max="1000" required>
                        </div>
                        </div>
                        <div class="col-lg-4">
                        <div class="form-group">
                            <label for="examDate">Exam Date</label>
                            <input type="date" class="form-control" id="examDate" name="examDate" required>
                        </div>
                        </div>
                        </div>  
                        <div class="form-group">
                            <label for="department">Department</label>
                            <select class="form-control" id="department" name="department" bind:value={department} required>
                                <option value="">Select Department</option>
                                <option value="CSE">CSE</option>
                                <option value="EEE">EEE</option>
                                <option value="MECH">MECH</option>
                                <option value="CIVIL">CIVIL</option>
                                <option value="ECE">ECE</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="semester">Semester</label>
                            <select class="form-control" id="semester" name="semester" bind:value={semester} on:change={fetchBatches} required>
                                <option value="">Select Semester</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="batch">Batch (Optional)</label>
                            <select class="form-control" id="batch" name="batch" required>
                                {#each batches as batch}
                                    <option value={batch}>{batch}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="center mt-4">
                        <button class="btn btn-secondary">Reset</button>
                        <button type="submit" class="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="card shadow mb-4">
                <div class="card-header py-3 bg-gradient-primary">
                    <h6 class="m-0 font-weight-bold white">Your Subject Basket</h6>
                </div>
                <div class="card-body">
                    GRADE
                </div>
            </div></div>

    </div>

</div>
<style>
    .text-gray-500 {
  color: #b7b9cc !important;
  font-size: 0.7rem;
  margin: 0;
  padding: 0;
}
.tbl-row {
    cursor: pointer;
}
.tbl-row:hover {
    background-color: #4e73df;
    color: white;
}
.tbl-row:hover td{
    color:white
}
tr:hover td {
    background-color: transparent; /* or #000 */
}
.center {
    display: flex;
    justify-content: center;
    gap: 10px;
}
.bg-gradient-primary {
    background-color: #4e73df;
    background-image: linear-gradient(180deg,#4e73df 10%,#224abe 100%);
    background-size: cover;
}
.progress {
  display: flex;
  height: 1rem;
  overflow: hidden;
  line-height: 0;
  font-size: 0.75rem;
  background-color: #eaecf4;
  border-radius: 0.35rem;
}
.white {
    color: white;
}
.progress-bar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  background-color: #4e73df;
  transition: width 0.6s ease;
}

@media (prefers-reduced-motion: reduce) {
  .progress-bar {
    transition: none;
  }
}

.progress-bar-striped {
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-size: 1rem 1rem;
}

.progress-bar-animated {
  -webkit-animation: 1s linear infinite progress-bar-stripes;
  animation: 1s linear infinite progress-bar-stripes;
}

@media (prefers-reduced-motion: reduce) {
  .progress-bar-animated {
    -webkit-animation: none;
    animation: none;
  }
}


</style>