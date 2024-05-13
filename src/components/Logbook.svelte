<script>
	import html2pdf from './html2pdf.bundle.min';
	const pdfTest = async () => {
		let element = document.getElementById('page1');
		console.log(element, html2pdf);
		html2pdf()
			.from(element)
			.set({
				margin: 0,
				filename: 'test.pdf',
				html2canvas: { scale: 1 },
				jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4', compressPDF: true }
			})
			.save();
	};
</script>
<button on:click={pdfTest}>Download PDF</button>

<div class="page1 center">
	<div class="subheader">
		<p>SRI VELLAPPALLY NATESAN COLLEGE OF ENGINEERING</p>
	</div>
	<div class="details">
		<p>KATTACHIRA, PALLICKAL P.O., MAVELIKARA, ALAPPUZHA</p>
	</div>

	<div class="header">
		<h2>ATTENDANCE AND ASSESSMENT RECORD</h2>
	</div>
	<div class="details">
		<p>Academic Year: 20.. to 20....</p>
	</div>

	<div class="details">
		<h3>Subject: COMPUTER PROGRAMMING & COMPUTATIONAL TECHNIQUES</h3>
		<p>Code: <span><u>CSE202</u><span></span></span></p>
		<p>Batch: ....5.6.</p>
		<p>Branch: ....CIVIL</p>
	</div>

	<div class="details">
		<h3>Name of Faculty</h3>
		<p>AMITHA R</p>
		<p>Designation: AP</p>
	</div>
</div>
<style>
    body {
      font-family: serif;
      margin: 20px;
    }
    .header {
      text-align: center;
      font-size: 18px;
    }
    .subheader {
      text-align: center;
      font-size: 16px;
      margin-top: 10px;
    }
    .details {
      font-size: 14px;
      margin-top: 20px;
      text-align: center;
    }
    .table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 30px;
    }
    .table th,
    .table td {
      border: 1px solid black;
      padding: 5px;
      text-align: left;
    }
    .table th {
      font-weight: bold;
    }
    .page1 {
      height:100vh;
      margin: auto 0;
      border: 1px solid black;
    }
    .center {
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  height: 877px;
  width:625px;
  border: 3px solid green;
}
  </style>