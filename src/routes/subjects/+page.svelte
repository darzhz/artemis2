<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
    export let data;
    const dataa = {
        subjects: [
            { id: 1, name: 'Math', type: 'Lecture', description: 'Mathematics', department: 'Mathematics', coursecode: 'MATH101' },
            { id: 2, name: 'Physics', type: 'Lab', description: 'Physics', department: 'Physics', coursecode: 'PHY101' },
            { id: 3, name: 'Chemistry', type: 'Lecture', description: 'Chemistry', department: 'Chemistry', coursecode: 'CHEM101' },
            { id: 4, name: 'Biology', type: 'Lab', description: 'Biology', department: 'Biology', coursecode: 'BIO101' },
            { id: 5, name: 'Computer Science', type: 'Lecture', description: 'Computer Science', department: 'Computer Science', coursecode: 'CS101' }
        ]
    };


    let search = '';
    let filter = '';
    let filteredSubjects = writable([]);

    onMount(() => {
        console.log(data);
        filteredSubjects.set(data.db.subjects);
    });

    $: $filteredSubjects = $filteredSubjects.filter(subject => subject.name.toLowerCase().includes(search.toLowerCase()));

    $: $filteredSubjects = $filteredSubjects.filter(subject => subject.type.toLowerCase().includes(filter.toLowerCase()));

    function editSubject(subject) {
        goto(`/subjects/edit/${subject.id}`);
    }

    function deleteSubject(subject) {
        subjects = subjects.filter(s => s.id !== subject.id);
        filteredSubjects.set(subjects);
    }

    function addSubject() {
        goto('/subjects/new');
    }
</script>

<div class="search-and-filter">
    <button class="add-button" on:click={addSubject}>Add Subject</button>
    <input type="text" bind:value={search} placeholder="Search Subjects" class="search-bar" />
    <select bind:value={filter} class="filter-dropdown">
        <option value="">All</option>
        <option value="Lab">Lab</option>
        <option value="Lecture">Lecture</option>
    </select>
</div>
<table class="table table-striped">
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Department</th>
            <th>Course Code</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {#each $filteredSubjects as subject}
            <tr>
                <td>{subject.name}</td>
                <td>{subject.type}</td>
                <td>{subject.description}</td>
                <td>{subject.department}</td>
                <td>{subject.code}</td>
                <td>
                    <button on:click={() => editSubject(subject)} class="action-button edit">Edit</button>
                    <button on:click={() => deleteSubject(subject)} class="action-button delete">Delete</button>
                </td>
            </tr>
        {/each}
    </tbody>
    </table>
<style>
    /* Base styles */

    table {
        width: 100%;
        border-collapse: collapse;
    }
    
    th, td {
        padding: 16px;
    }
    
    th {
        background-color: #f2f2f2;
    }

    /* Specific element styles */
    .add-button {
        background-color: #4CAF50; /* Green */
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
    }

    .search-and-filter {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    .search-bar,
    .filter-dropdown {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .action-button {
        background-color: transparent;
        border: none;
        color: #2196F3; /* Blue */
        padding: 0 5px;
        cursor: pointer;
    }
    </style>
