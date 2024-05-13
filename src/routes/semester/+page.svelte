
<script>
    let department = "All";
    let semesters = [
        {
            id: 1,
            name: "S 1",
            department: "CSE",
            startDate: "2021-08-01",
            endDate: "2021-12-31",
            status: "Active",
        },
        {
            id: 2,
            name: "S 2",
            department: "CSE",
            startDate: "2022-01-01",
            endDate: "2022-05-31",
            status: "Active",
        },
        {
            id: 3,
            name: "S 3",
            department: "CSE",
            startDate: "2022-06-01",
            endDate: "2022-10-31",
            status: "Active",
        },
        {
            id: 4,
            name: "S 4",
            department: "CSE",
            startDate: "2022-11-01",
            endDate: "2023-03-31",
            status: "Active",
        },
        {
            id: 5,
            name: "S 5",
            department: "CSE",
            startDate: "2023-04-01",
            endDate: "2023-08-31",
            status: "Active",
        },
        {
            id: 6,
            name: "S 6",
            department: "CSE",
            startDate: "2023-09-01",
            endDate: "2023-12-31",
            status: "Active",
        },
        {
            id: 7,
            name: "S 7",
            department: "CSE",
            startDate: "2024-01-01",
            endDate: "2024-05-31",
            status: "Active",
        },
        {
            id: 8,
            name: "S 8",
            department: "CSE",
            startDate: "2024-06-01",
            endDate: "2024-10-31",
            status: "Active",
        },
    ];

</script>
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title text-center">Semesters</h4>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group mb-3">
                                <label for="department">Department</label>
                                <select bind:value={department} class="form-control">
                                    <option value="All">All</option>
                                    <option value="CSE">Computer Science</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Electronics and Communication">Electronics and Communication</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each semesters as semester}
                                    {#if department === "All" || department === semester.department}
                                        <tr>
                                            <td>{semester.id}</td>
                                            <td>{semester.name}</td>
                                            <td>{semester.department}</td>
                                            <td>{semester.startDate}</td>
                                            <td>{semester.endDate}</td>
                                            <td>{semester.status}</td>
                                            <td>
                                                <a href="semester/{semester.department}/{semester.id}" class="btn btn-primary btn-sm">View</a>
                                            </td>
                                        </tr>
                                    {/if}
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    .container {
        padding: 20px;
    }
</style>
