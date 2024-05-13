<script>
 import TimeAdapt from "../components/TimeAdapt.svelte";
</script>
<div class="container">
  <div class="row justify-content-center">  <div class="col-12">
      <h1 class="text-center">Welcome to Artemis Management Information System</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-md-3 mb-3">  <div class="card shadow-sm" style="background-color: #ebeef1">  <div class="card-body">
          <h5 class="card-title text-center">Total Students</h5>  <p class="card-text text-center font-weight-bold" >100</p>
        </div>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="card shadow-sm" style="background-color: #f8f9fa">  <div class="card-body">
          <h5 class="card-title text-center">Total Faculties</h5>  <p class="card-text text-center font-weight-bold" >10</p>
        </div>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="card shadow-sm" style="background-color: #ebeef1">  <div class="card-body">
          <h5 class="card-title text-center">Total Departments</h5>  <p class="card-text text-center font-weight-bold" >5</p>
        </div>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="card shadow-sm" style="background-color: #f8f9fa">  <div class="card-body">
          <h5 class="card-title text-center">Total Subjects</h5>  <p class="card-text text-center font-weight-bold" >20</p>
        </div>
      </div>
    </div>
  </div>
</div>
<hr/>
  <!-- <TimeAdapt/> -->
<style>
    .card {
        border-radius: 1rem;
    }
    .card-title {
        font-family: sans-serif;

    }
    .card-text {
        font-family: sans-serif;
    }
    .card-body {
        color: white;
        background-color: #4e73df;
        border-radius: 1rem;
    }
</style>