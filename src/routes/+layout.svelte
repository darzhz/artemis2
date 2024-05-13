<script>
    import 'bootstrap/dist/css/bootstrap.min.css';
    import Dash from '../components/dash.svelte';
    import Login from '../components/Login.svelte';
    import { user } from '../stores/auth.js';
    let isLoggedIn = false;
    $: if (!$user) {
        isLoggedIn = false;
    } else {
        isLoggedIn = true;
    }
</script>
{#if isLoggedIn}
    <Dash>
        <slot/>
    </Dash>
{:else}
    <Login/>
{/if}
<!-- <Dash content="Hello World">
<slot/>
</Dash>
<Login/> -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Metrophobic&display=swap');
    * {
        font-family: 'Metrophobic', sans-serif;
        font-weight: 400;
        font-style: normal;
    }
    
</style>