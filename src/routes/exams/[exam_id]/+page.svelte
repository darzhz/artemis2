<script>
    export let data;
    let examInfo = data.db.thisExam[0];
    let markInfo = data.db.thisMark;
    console.log(markInfo);
    let subjectInfo = data.db.subjectInfo[0];
    let studentInfo = data.db.studentInfo;
    let activeTab = 0;
    const subArray = subjectInfo.subjects.split(',');
    function switchTab(index) {
      activeTab = index;
    }
    function isPassed(index,code){
      let percentage = markInfo[index].marks/examInfo.max_mark*100;
      if(markInfo[index].marks == null){
        return `<span class='text-muted'>Unmarked</span>`;
      }
      else if(markInfo[index].marks >= examInfo.min_mark){
        return `<span class='text-success'>Pass ${percentage}%</span>`;
      }
      else{
        return `<span class='text-danger'>Fail ${percentage}%</span>`;
      }
    }
    const handleMarkChange = (index,event) => {
      markInfo[index].marks = event.target.value;
      // Create FormData object
      const formData = new FormData();

      // Append each key-value pair from JSON to FormData
      formData.append('student_id', markInfo[index].student_id);
      formData.append('exam_id', examInfo.exam_id);
      formData.append('marks', event.target.value);
      formData.append('subject_id', markInfo[index].subject_id);
      console.log(markInfo[index].student_id);

      // Send FormData with fetch
      fetch(`/exams/${examInfo.exam_id}?/update`, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
};
  </script>
  
  <h1>Exam Details</h1>
  <div class="exam-info row tabs-container">
    <div class="col-md-3">
      <p><strong>Exam ID:</strong> {examInfo.exam_id}</p>
      <p><strong>Exam Type:</strong> {examInfo.exam_type}</p>
      <p><strong>Max Mark:</strong> {examInfo.max_mark}</p>
      <p><strong>Min Mark:</strong> {examInfo.min_mark}</p>
    </div>
    <div class="col-md-3">
      <p><strong>Exam Date:</strong> {examInfo.exam_date}</p>
      <p><strong>Department:</strong> {examInfo.department}</p>
      <p><strong>Semester:</strong> {examInfo.semester}</p>
      <p><strong>Batch:</strong> {examInfo.batch}</p>
    </div>
  </div>
  
  <div class="tabs-container">
    <div class="tab">
      <!-- {#each [0, 1, 2] as index}
        <button
          class:active={activeTab === index}
          on:click={() => switchTab(index)}
        >
          {#if index === 0}
            Math
          {:else if index === 1}
            English
          {:else}
            Science
          {/if}
        </button>
      {/each} -->
      {#each subArray as subject, index}
        <button
          class:active={activeTab === index}
          on:click={() => switchTab(index)}
        >
          {subject}
        </button>
      {/each}
    </div>
    {#each subArray as subject, index}
      <div class="tab-content" class:active={activeTab === index}>
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Subject ID</th>
              <th>Exam Mark</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {#each markInfo as student,index }
            {#if student.code == subject}
            <tr>
              <td>{student.name}</td>
              <td>{student.student_id}</td>
              <td>{student.code}</td>
              <td><input type="number" value="{student.marks == null?0:student.marks}" on:change={event => handleMarkChange(index,event)} max={examInfo.max_mark}></td>
              <td>{@html isPassed(index,student.code)}</td>
            </tr>
            {/if}
            {/each}

          </tbody>
        </table>
      </div>
    {/each}
  </div>
  

<style>
     /* Tabs container */
.tabs-container {
  max-width: 48rem; /* max-w-4xl */
  margin-left: auto;
  margin-right: auto;
}

/* Tabs */
.tab {
  display: flex;
  border-bottom: 1px solid #e2e8f0; /* border-b */
}

.tab button {
  flex: 1;
  padding: 0.75rem 1rem; /* px-3 py-1 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #4b5563; /* text-muted-foreground */
  background-color: #edf2f7; /* bg-muted */
  border: none;
  border-right: 1px solid #e2e8f0; /* border */
  transition: background-color 0.2s;
}

.tab button:last-child {
  border-right: none;
}

.tab button.active {
  color: #fff; /* text-foreground */
  background-color: #2563eb; /* bg-background */
}

/* Tab content */
.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

.tab-content table {
  width: 100%;
  border-collapse: collapse;
}

.tab-content th,
.tab-content td {
  padding: 1rem; /* p-4 */
  border-bottom: 1px solid #e2e8f0; /* border-b */
}

.tab-content th {
  font-weight: 500; /* font-medium */
  color: #4b5563; /* text-muted-foreground */
}

.tab-content input {
  width: 100%;
  height: 2.5rem; /* h-10 */
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  border: 1px solid #cbd5e0; /* border-input */
  border-radius: 0.375rem; /* rounded-md */
  font-size: 0.875rem; /* text-sm */
  color: #1a202c; /* text-input */
}

.tab-content input:focus {
  outline: 2px solid #2563eb; /* focus-visible:ring-2 */
  outline-offset: 2px; /* focus-visible:ring-offset-2 */
}

.tab-content button {
  margin-top: 1.5rem; /* mt-6 */
  padding: 0.75rem 1rem; /* px-4 py-2 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #fff; /* text-primary-foreground */
  background-color: #2563eb; /* bg-primary */
  border: none;
  border-radius: 0.375rem; /* rounded-md */
  transition: background-color 0.2s;
}

.tab-content button:hover {
  background-color: #3b82f6; /* hover:bg-primary/90 */
}

.tab-content button:disabled {
  cursor: not-allowed; /* disabled:cursor-not-allowed */
  opacity: 0.5; /* disabled:opacity-50 */
}
</style>