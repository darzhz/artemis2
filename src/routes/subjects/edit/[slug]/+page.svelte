<!-- This page is to create a edit subject with the following fields: name, type, description, department, course code,syllabus -->
<script>
       import { onMount } from 'svelte';
       import { goto } from '$app/navigation';
       export let data;
       console.log(data);
       let syllabus = data.db.syllabus.split('\n').map(line => {
                   const [index, module_name, topic_name, no_of_hours] = line.split(',');
                   return { index, module_name, topic_name, no_of_hours };
               });;
       let name = data.db.subjectData[0].name;
       let type = data.db.subjectData[0].type;
       let description = data.db.subjectData[0].description;
       let department = data.db.subjectData[0].department;
       let coursecode = data.db.subjectData[0].code;
       let file = null;
       async function createSubject(formData) {
           const response = await fetch('/subjects/edit?/', {
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
                   const [index, module_name, topic_name, no_of_hours] = line.split(',');
                   return { index, module_name, topic_name, no_of_hours };
               });
           };
           reader.readAsText(file);
       }
   
   </script>
   <div class="create-subject-container">
       <h1>Edit Subject : {name} {data.db.slug}</h1>
       <form action="/subjects/edit/{data.db.slug}?/update" method="post" enctype="multipart/form-data" class="subject-form">
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
           <select id="department" name="department" bind:value={department}>
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
           <label for="syllabus">Syllabus (Text File Only) index, module_name, topic_name, no_of_hours:</label>
           <input type="file" id="syllabus" name="syllabus" accept=".txt"  on:change={handleFileChange}>
         </div>
         <div class="form-actions">
           <button type="submit" class="primary-button">Update</button>
           <button type="button" class="secondary-button" on:click="{()=>{window.location.href='/subjects'}}">Cancel</button>
         </div>
       </form>
       {#if syllabus}
         <h2>Syllabus Preview</h2>
         <table>
           <thead>
             <tr>
               <th>Index</th>
               <th>Module Name</th>
               <th>Topic Name</th>
               <th>No of Hours</th>
             </tr>
           </thead>
           <tbody>
             {#each syllabus as { index, module_name, topic_name, no_of_hours }}
               <tr>
                 <td>{index}</td>
                 <td>{module_name}</td>
                 <td>{topic_name}</td>
                 <td>{no_of_hours}</td>
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