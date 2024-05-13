<script>
    import  { ReactAdapter } from "svelte-react-kit";
    import  Attendence from "./Attendence.jsx";
    export let inputArray = [];
</script>
<!-- a conatiner that is used to select the batch the faculty is on -->
<ReactAdapter
  el={Attendence}
  class="mui-btn"
  children="Hello"
  props={inputArray}
  variant="contained"
  color="primary"
  onClick={() => alert("hello world!")}
/>