<script>
  import { Canvas } from '@threlte/core';
  import Scroller from "@sveltejs/svelte-scroller";
  import Scene from '$lib/Scene.svelte';

  let index, offset, progress;
  const stepCount = 5;
  const sections = Array(stepCount).fill('x');

</script>

<Scroller bind:index bind:offset bind:progress>
  <div slot="background" class="canvas-wrapper">
    <Canvas colorManagementEnabled={false}>
      <Scene {index} {offset} {progress} {stepCount}/>
    </Canvas>
  </div>
  <div slot="foreground" class="content">

    {#each sections as section, idx}
      <section class:active={index === idx}>
        <h1>Section {idx}</h1>
      </section>
    {/each}  
  </div>
</Scroller>


<style>
  .canvas-wrapper {
    position: absolute;
    width: 100%;
    height: 100vh;
    background: #161616;
    overflow: hidden;
  }

  .content {
    padding: 0 0 25vh;
  }

  section {
    height: 500px;
    max-width: 100%;
    width: 500px;
    margin: 10rem auto;
    border: 2px solid white;
    color: #ffffff;
  }

  section.active {
    border: 2px solid #00ff00;
  }

</style>