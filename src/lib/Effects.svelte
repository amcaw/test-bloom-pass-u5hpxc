<script lang="ts">
  import { useTask, useThrelte } from '@threlte/core'
  import {
    BlendFunction,
    EffectComposer,
    EffectPass,
    BloomEffect,
    RenderPass
  } from 'postprocessing'
  import { onMount } from 'svelte'


  const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte()

  const composer = new EffectComposer(renderer)

  const setupEffectComposer = (camera) => {
    composer.removeAllPasses()
    composer.addPass(new RenderPass(scene, camera))

    const bloomEffect = new BloomEffect({
      luminanceThreshold: 0.3,
      intensity: 2,
    })
    composer.addPass(new EffectPass(camera, bloomEffect))
  }

  $: setupEffectComposer($camera)
  $: composer.setSize($size.width, $size.height)

  onMount(() => {
    let before = autoRender.current
    autoRender.set(false)
    return () => {
      autoRender.set(before)
    }
  })

  useTask(
    (delta) => {
      composer.render(delta)
    },
    { stage: renderStage, autoInvalidate: false }
  )
</script>
