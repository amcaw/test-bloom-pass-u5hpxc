<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { T, useFrame } from '@threlte/core';
  import { Grid } from '@threlte/extras';
  import { tweened } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import { generateRingSteps } from '$lib/utils';
  import { injectLookAtPlugin } from '$lib/lookAt';
  import Effects from '$lib/Effects.svelte'
  export let index;
  export let stepCount;

  injectLookAtPlugin(); // Custom plugin to add `lookAt` prop to all <T> components

  let r = 0;
  let meshRef;
  const cameraPosition = tweened(null, { duration: 1000, easing: cubicInOut });

  let moonTexture, moonMesh, redPointMesh; // References for the moon and red point meshes
  const moonRadius = 1; // Moon radius

  useFrame((_, delta) => {
    r += 0.5 * delta;
  });

  // Predefined locations for camera movement
  const cameraSteps = [
    ...generateRingSteps(stepCount, 20)
  ];

  // Update camera position based on scroller index
  $: cameraPosition.set(cameraSteps[index] ?? cameraSteps[0]);

  // Function to convert latitude and longitude to 3D coordinates
  function latLongToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  // Category to color mapping
  const categoryColors = {
    "category_1": "#0000ff", // Blue for category_1
    "category_2": "#ff0000", // Red for category_2
  };

  function createPoint(lat, lon, category) {
    const pointColor = categoryColors[category] || '#ffffff';
    const pointGeometry = new THREE.SphereGeometry(0.02, 32, 32);
    const pointMaterial = new THREE.MeshStandardMaterial({
      emissive: pointColor,
      emissiveIntensity: 2,
      toneMapped: false,
    });
    const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);

    const pointPosition = latLongToVector3(lat, lon, moonRadius);
    pointMesh.position.copy(pointPosition);
    meshRef.add(pointMesh);
  }

  // Updated loadPointsData function
  async function loadPointsData() {
    const response = await fetch('./points.json');
    const pointsData = await response.json();
    pointsData.forEach(point => {
      createPoint(point.latitude, point.longitude, point.kind);
    });
  }


  onMount(() => {
    const loader = new THREE.TextureLoader();
    moonTexture = loader.load('./moon.jpg'); // Load the moon texture
    loadPointsData(); // Load the points data and create points
  });

  
</script>

<T.PerspectiveCamera 
    makeDefault
    position.x={$cameraPosition.x}
    position.y={$cameraPosition.y}
    position.z={$cameraPosition.z}
    fov={8}
    lookAt={meshRef}
/>

<T.HemisphereLight intensity={1}/>

<T.Mesh bind:ref={meshRef}>
  <T.SphereGeometry radius={moonRadius} widthSegments={32} heightSegments={32} />
  <T.MeshStandardMaterial map={moonTexture} />
</T.Mesh>

<Grid 
  infiniteGrid 
  fadeDistance={50} 
  cellColor="#ffffff"
  sectionColor="#ff0500"
/>

<Effects />