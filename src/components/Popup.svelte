<script>
    import { createEventDispatcher, onDestroy } from 'svelte';
    let dispatch = createEventDispatcher();
    const close = () => dispatch('close');
  </script>
  <div class="container">
    <div class="cookiesContent" id="cookiesPopup">
      <button class="close" on:click={() => close()}>✖</button>
      <img src="https://cdn-icons-png.flaticon.com/512/595/595067.png" alt="Info" />
      <p>
        <slot>
          
        </slot>
      </p>
      <button class="accept" on:click={() => close()}>Okay!</button>
    </div>
  </div>
  <style>
  .cookiesContent {
      width: 320px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: var(--tri);
      backdrop-filter: blur(8px);
      color: #fff;
      text-align: center;
      border-radius: 20px;
      /* padding: 30px 30px 70px; */
      padding-bottom: 50px;
      position: absolute;
      top: calc(50vh - 200px);
      z-index: 1;
      box-shadow: 0px 0px 6px 0px black;
  }
  .cookiesContent button.close {
    width: 30px;
    font-size: 20px;
    color: #c0c5cb;
    align-self: flex-end;
    background-color: rgba(0, 0, 0, 0.39);
    border: none;
    margin-bottom: 10px;
  }
  .cookiesContent img {
    width: 82px;
    margin-bottom: 15px;
  }
  .cookiesContent p {
    margin-bottom: 40px;
    font-size: 18px;
    color:#ed6755;
  }
  .cookiesContent button.accept {
    background-color: #ed6755;
    border: none;
    border-radius: 5px;
    width: 200px;
    padding: 14px;
    font-size: 16px;
    color: white;
    box-shadow: 0px 6px 18px -5px #ed6755;
  }
  </style>