<script>
    import Popup from '../../components/Popup.svelte';
    //a simple download page with a form that has a 4 select dropdown department,semester,batch and type of report
    let data;
    let department = "";
    let semester = "";
    let batch = "";
    let type = "";
    export let form;
    let batches = [];
    let showPopup = false;
    if (form && form.status == 200) {
        showPopup = true;
    }
    const fetchBatches = async () => {
        const formData = new FormData();
        formData.append('department', department);
        formData.append('semester', semester);
        const res = await fetch(`?/getData`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        const batch = JSON.parse(data.data)[2];
        console.log(data);
        batches = JSON.parse(batch);
    }
</script>
<div class="box">
<form method="post" action="/downloads?/download">
    {#if showPopup}
        <Popup on:close={()=>{showPopup=false}}>
            {#if form.body.isLink}
                <p>{@html form.body.message}</p>
            {:else}
                <p>{form.body.message}</p>
            {/if}
        </Popup>
    {/if}
    <div class="form-group">
        <label for="department">Department</label>
        <select id="department" name="department" bind:value={department}>
            <option value="cse">CSE</option>
            <option value="eee">EEE</option>
            <option value="mech">MECH</option>
            <option value="civil">CIVIL</option>
            <option value="ece">ECE</option>
        </select>
    </div>

    <div class="form-group">
        <label for="semester">Semester</label>
        <select id="semester" name="semester" bind:value={semester} on:change={fetchBatches}>
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
        <label for="batch">Batch</label>
        <select id="batch" name="batch" bind:value={batch}>
            {#each batches as batch}
                <option value={batch}>{batch}</option>
            {/each}
        </select>
    </div>
    <div class="form-group">
        <label for="type">Type</label>
        <select id="type" name="type" bind:value={type}>
            <option value="Syllabus">Syllabus</option>
            <option value="Time-Table">Time Table</option>
            <option value="Lesson-Plan">Lesson Plan</option>
            <option value="Record-of-Classwork">Record of Classwork</option>
            <option value="Attendence-Report">Attendence Report</option>
            <option value="continous-assessment">Continous Assessment</option>
        </select>
    </div>
    <button type="submit">Download</button>
</form>
</div>
<style>
    .box {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    form {
        display: flex;
    flex-direction: column;
    align-items: center;
    padding: 150px;
    border: 1px solid lightgrey;
    border-radius: 10px;
    }
    .form-group {
        margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    }

    label {
        font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    }

    select,
    button {
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 200px;
    }

    button {
        background-color: #4CAF50; /* Green */
        height: 40px;
        color: white;
        cursor: pointer;
    }

    button:hover {
        background-color: #45A049;
    }
</style>