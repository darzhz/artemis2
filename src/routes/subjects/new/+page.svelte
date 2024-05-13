<!-- This page is to create a new subject with the following fields: name, type, description, department, course code,syllabus -->
<script>
 //This page is to create a new subject with the following fields: name, type, description, department, course code,syllabus
//The form is submitted to the server and the subject is added to the database
//The user is then redirected to the subjects page
//The user can also cancel the creation of the subject and return to the subjects page
//The user can also upload a syllabus file
//The user can also view the syllabus file before submitting the form
//The user can also delete the syllabus file before submitting the form
//Each entry in the syllabus file is of the form "index. module_name topic_name no_of_hours",file is in text format
//the user interface is designed using svelte and is very userfriendly
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    let syllabus = null;
    let name = '';
    let type = '';
    let description = '';
    let department = '';
    let coursecode = '';
    let file = null;
    async function createSubject(formData) {
        const response = await fetch('/api/subjects', {
            method: 'POST',
            body: formData
        });
        return response;
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('description', description);
        formData.append('department', department);
        formData.append('coursecode', coursecode);
        formData.append('syllabus', file);
        const response = await createSubject(formData);
        if (response.ok) {
            goto('/subjects');
        }
    }
    function handleFileChange(event) {
        file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function() {
            syllabus = reader.result.split('\n').map(line => {
                const [index, module_name, topic_name, no_of_hours,DateOfCommencement,DateOfCompletion] = line.split(',');
                //dont return last line if it is empty
                return { index, module_name, topic_name, no_of_hours,DateOfCommencement,DateOfCompletion };
            });
            //remove last line if it is empty
            if (syllabus[syllabus.length - 1].index === '') {
                syllabus.pop();
            }
        };
        reader.readAsText(file);
    }

</script>
<div class="create-subject-container">
    <h1>Create New Subject</h1>
    <form action="/subjects/new?/create" method="post" enctype="multipart/form-data" class="subject-form">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" bind:value={name} required>
      </div>
      <div class="form-group">
        <label for="type">Type:</label>
        <select id="type" name="type" bind:value={type} required>
          <option value="Lab">Lab</option>
          <option value="Lecture">Lecture</option>
        </select>
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" name="description" bind:value={description} required></textarea>
      </div>
      <div class="form-group">
        <label for="department">Department:</label>
        <select id="department" name="department" bind:value={department} required>
          <option value="cse">CSE</option>
          <option value="eee">EEE</option>
          <option value="mech">MECH</option>
          <option value="civil">CIVIL</option>
          <option value="ece">ECE</option>
        </select>
      </div>
      <div class="form-group">
        <label for="coursecode">Course Code:</label>
        <input type="text" id="coursecode" name="coursecode" bind:value={coursecode} required>
      </div>
      <div class="form-group">
        <label for="syllabus">Lesson Plan (Text File Only) index, module_name, topic_name, no_of_hours,date_of_commencement,date_of_completion:</label>
        <input type="file" id="syllabus" name="syllabus" accept=".txt" required on:change={handleFileChange}>
      </div>
      <div class="form-actions">
        <button type="submit" class="primary-button">Create</button>
        <button type="button" class="secondary-button" on:click="{()=>{window.location.href='/subjects'}}">Cancel</button>
      </div>
    </form>
    {#if syllabus}
      <h2>Lesson Plan Preview</h2>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Module Name</th>
            <th>Topic Name</th>
            <th>No of Hours</th>
            <th>Date of Commencement</th>
            <th>Date of Completion</th>
          </tr>
        </thead>
        <tbody>
          {#each syllabus as { index, module_name, topic_name, no_of_hours,DateOfCommencement,DateOfCompletion }}
            <tr>
              <td>{index}</td>
              <td>{module_name}</td>
              <td>{topic_name}</td>
              <td>{no_of_hours}</td>
              <td>{DateOfCommencement}</td>
              <td>{DateOfCompletion}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <button on:click={() => syllabus = null}>Delete Syllabus</button>
    {/if}
  </div>
  
  <style>
    /* Base styles */
    /* Make the buttons well styled */
    button {
      background-color: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

  
    .create-subject-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 5px;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    }
  
    h1 {
      text-align: center;
      margin-bottom: 1rem;
    }
  
    .subject-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }
  
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  
    label {
      font-weight: bold;
    }
  
    input[type="text"],
    input[type="file"],
    select,
    textarea {
      padding: 0.5rem;
      border: 1px solid #ccc;
        border-radius: 5px;
    }
</style>