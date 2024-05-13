<script>
  export let subjects = ['cst233','cst113','cst122'];
</script>
<svelte:head>
  <script src="https://cdn.tailwindcss.com"></script>
</svelte:head>
<div class="grid h-screen grid-cols-[250px_1fr] gap-4">
	<div class="p-4 border-r overflow-auto">
		<h2 class="text-lg font-semibold">Subjects</h2>
		<p class="day">Currently Selected : N/A</p>
		<div class="semster-selector flex">
			<label for="semester" class=" text-sm font-light">Enter semester</label><input
				type="number"
				name="semester"
				placeholder="1"
				class=" w-16 text-center"
				min="1"
			/>
		</div>
		<div class="flex justify-between items-center mb-4">
			<select id="sub_code" name="sub_code" class="w-full p-2 border rounded-md"
				><option>select any subject</option><option value="CS202" data-attribute="53"
					><div>
						<p>CS202 - 53</p>
						<p></p>
						<p></p>
					</div></option
				><option value="CS201" data-attribute="53"
					><div>
						<p>CS201 - 53</p>
						<p></p>
						<p></p>
					</div></option
				><option value="mecon" data-attribute="63"
					><div>
						<p>mecon - 63</p>
						<p></p>
					</div></option
				></select
			><button class="bg-green-500 text-gray-100 btn h-8">+ Sub</button>
		</div>
		<div class="grid gap-4">
      {#each subjects as subject}
        <div class="border rounded-md p-2">
          <p>{subject}</p>
        </div>
      {/each}
    </div>
	</div>
	<div class="p-4">
		<h2 class="text-lg font-semibold mb-4">Timetable</h2>
		<div class="grid grid-cols-7 gap-2">
			<div class="col-span-1">Hr 1</div>
			<div class="col-span-1">Hr 2</div>
			<div class="col-span-1">Hr 3</div>
			<div class="col-span-1">Hr 4</div>
			<div class="col-span-1">Hr 5</div>
			<div class="col-span-1">Hr 6</div>
			<div class="col-span-1">Hr 7</div>
      {#each [...Array(6).keys()] as row}
        {#each [...Array(7).keys()] as col}
        <div row="0" col="0" class="col-span-1 border rounded-md Box TBox subject-1">
          <sub row="0" col="0" id="subIndex">Mon</sub><span
            row="0"
            col="0"
            id="subIndex"
            class="day"
            rendered="N/A">N/A</span>
		</div>
        {/each}
      {/each}
      </div>
</div>
		<div class="control">
			<button class="btn btn-outline btn-accent">save</button><button
				class="btn btn-outline btn-warning">reset</button
			><button class="btn btn-outline btn-info">Generate Timetable</button>
		</div>
	</div>
<style>
  .TBox {
    min-height: 65px;
  }
  .TBox:hover{
    transition: transform ease-in-out 100ms;
    box-shadow: 0px 0px 15px 6px #adb1ff;
    border: none;
    transform: scale3d(1.2, 1.2, 1.2);
  }
  .Box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .day {
    font-size: x-small;
    color: rgb(129, 125, 125);
    font-family: roboto;
    pointer-events: none;
}
</style>