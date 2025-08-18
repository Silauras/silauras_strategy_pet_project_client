<script setup>
import { ref } from "vue";
import GridCanvas from "@/components/GridCanvas.vue"

const zoom = ref(1);
</script>

<template>
  <div style="position: relative;">
    <GridCanvas @update:zoom="zoom = $event"/>

  </div>

  <div
      style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.6); color: white; padding: 6px 10px; border-radius: 4px; font-size: 14px;">
    Zoom: {{ zoom.toFixed(2) }}
  </div>

</template>

<style scoped>

</style>
